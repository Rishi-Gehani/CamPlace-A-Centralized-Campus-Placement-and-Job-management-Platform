/* global process */
import express from 'express';
import QuizResult from '../models/QuizResult.js';
import { auth } from '../middleware/auth.js';
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

// Check if student has already taken the quiz for a department
router.get('/check/:department', auth, async (req, res) => {
  try {
    const result = await QuizResult.findOne({
      student: req.user.id,
      department: req.params.department
    });
    
    if (result) {
      return res.json({ completed: true, result });
    }
    
    res.json({ completed: false });
  } catch (error) {
    console.error('Error checking quiz status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit quiz results
router.post('/submit', auth, async (req, res) => {
  try {
    const { department, score, maxScore, percentage, qnaHistory } = req.body;
    
    // Check if already exists (extra safety)
    const existing = await QuizResult.findOne({
      student: req.user.id,
      department
    });
    
    if (existing) {
      return res.status(400).json({ message: 'Quiz already completed for this department' });
    }

    // Initialize Gemini AI
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const model = "gemini-3.1-flash-lite-preview";

    const prompt = `You are a ruthless but highly effective expert recruiter and senior hiring manager specializing in the ${department} industry with 15+ years of experience. You do not sugarcoat your advice. Your goal is to give students a brutal reality check and an exact, executable roadmap to get hired in a highly competitive, recessive market.

A student has just taken a placement readiness assessment for the ${department} track.
They scored ${score} out of ${maxScore}.

Here is the exact history of the questions they were asked, the answers they selected, and the points they received (0 = Critical Failure, 1 = Weak, 3 = Strong):
${JSON.stringify(qnaHistory, null, 2)}

Based on their specific answers, provide exactly 3 personalized, highly actionable insights. 
Focus heavily on the areas where they scored 0 or 1. Tell them exactly why they will be rejected in the current market by a ${department} hiring manager, and exactly what they must do this week to fix it. Do not use generic, fluffy advice.

You MUST return the response as a valid JSON array containing exactly 3 objects. Each object must have the exact following keys:
- "title": A punchy, brutally honest 3-4 word title (e.g., "Your Resume is Invisible", "Theory Won't Save You").
- "harsh_truth": A 2-sentence reality check explaining exactly why their specific answer will get them auto-rejected or failed in an interview in the ${department} sector.
- "action_step": A strict, executable 1-2 sentence plan of what they must do IMMEDIATELY to fix this specific weakness.

Return ONLY the raw JSON array. Do not include markdown code blocks (like \`\`\`json), conversational text, greetings, or any other formatting.`;

    let insights = [];
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });
      
      const text = response.text;
      // Clean the response in case AI includes markdown blocks
      const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      insights = JSON.parse(cleanedText);
    } catch (aiError) {
      console.error('Gemini AI Error:', aiError);
      // Fallback insights if AI fails
      insights = [
        {
          title: "AI Analysis Failed",
          harsh_truth: "We couldn't generate personalized insights at this moment due to a technical glitch.",
          action_step: "Review your answers manually and focus on the areas where you scored 0 or 1."
        }
      ];
    }
    
    const newResult = new QuizResult({
      student: req.user.id,
      department,
      score,
      maxScore,
      percentage,
      insights
    });
    
    await newResult.save();
    res.status(201).json(newResult);
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all quiz results for current student
router.get('/results', auth, async (req, res) => {
  try {
    const results = await QuizResult.find({ student: req.user.id });
    res.json(results);
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
