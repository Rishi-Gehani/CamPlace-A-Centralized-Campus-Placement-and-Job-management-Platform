export const QUIZ_QUESTIONS = {
  "maxScore": 39,
  "coreQuestions": [
    {
      "id": "c1",
      "question": "How many relevant internships, co-ops, or freelance gigs have you completed?",
      "options": [
        { "text": "2 or more solid experiences.", "points": 3 },
        { "text": "1 basic internship or gig.", "points": 1 },
        { "text": "None yet.", "points": 0 }
      ]
    },
    {
      "id": "c2",
      "question": "Do you have a portfolio of real-world projects that solve an actual problem (not just guided academic assignments)?",
      "options": [
        { "text": "Yes, live and documented.", "points": 3 },
        { "text": "Yes, but they are basic academic clones.", "points": 1 },
        { "text": "No portfolio yet.", "points": 0 }
      ]
    },
    {
      "id": "c3",
      "question": "How effectively do you use AI tools (ChatGPT, Copilot, Claude) for your daily work/study?",
      "options": [
        { "text": "Daily. I use them to brainstorm, debug, and accelerate my output.", "points": 3 },
        { "text": "Occasionally, mostly just to look up quick answers.", "points": 1 },
        { "text": "Rarely or never.", "points": 0 }
      ]
    },
    {
      "id": "c4",
      "question": "Is your resume strictly text-based, formatted specifically to pass Applicant Tracking Systems (ATS)?",
      "options": [
        { "text": "Yes, single column, standard fonts, highly tailored.", "points": 3 },
        { "text": "Not sure if it passes ATS.", "points": 1 },
        { "text": "No, it has graphics, multiple columns, or a photo.", "points": 0 }
      ]
    },
    {
      "id": "c5",
      "question": "Can you confidently answer behavioral questions like 'Tell me about a time you failed' using the STAR method?",
      "options": [
        { "text": "Yes, I have rehearsed STAR stories ready.", "points": 3 },
        { "text": "I know the concept but haven't practiced.", "points": 1 },
        { "text": "No, I usually improvise.", "points": 0 }
      ]
    },
    {
      "id": "c6",
      "question": "Do you actively reach out to alumni, recruiters, or employees on LinkedIn?",
      "options": [
        { "text": "Frequently. I network and ask for referrals.", "points": 3 },
        { "text": "Sometimes, but mostly I just apply on portals.", "points": 1 },
        { "text": "Never. I only submit cold applications.", "points": 0 }
      ]
    }
  ],
  "tracks": {
    "Computer Science & IT": [
      {
        "id": "cs1",
        "question": "How comfortable are you solving medium-level Data Structures & Algorithms (DSA) problems without an IDE?",
        "options": [
          { "text": "Very comfortable. I practice regularly.", "points": 3 },
          { "text": "I can do basic arrays/strings, but struggle with trees/graphs.", "points": 1 },
          { "text": "I rely heavily on the IDE and struggle with logic.", "points": 0 }
        ]
      },
      {
        "id": "cs2",
        "question": "Can you confidently manage Git branches, resolve merge conflicts, and do pull requests in a team setting?",
        "options": [
          { "text": "Yes, I use Git collaboratively.", "points": 3 },
          { "text": "I only know basic add, commit, and push.", "points": 1 },
          { "text": "I don't use version control.", "points": 0 }
        ]
      },
      {
        "id": "cs3",
        "question": "Have you ever deployed a full-stack application to a live server or cloud provider (AWS, Vercel, Azure)?",
        "options": [
          { "text": "Yes, multiple times.", "points": 3 },
          { "text": "I've deployed a basic frontend, but not a database/backend.", "points": 1 },
          { "text": "No, everything just runs on localhost.", "points": 0 }
        ]
      },
      {
        "id": "cs4",
        "question": "Do you understand System Design basics (how the internet works, load balancing, caching)?",
        "options": [
          { "text": "Yes, I can design a basic scalable architecture.", "points": 3 },
          { "text": "I know the buzzwords but couldn't explain them deeply.", "points": 1 },
          { "text": "No.", "points": 0 }
        ]
      },
      {
        "id": "cs5",
        "question": "Do you know how to write basic unit tests or integration tests for your code?",
        "options": [
          { "text": "Yes, I write tests for my core logic.", "points": 3 },
          { "text": "I know what they are but rarely write them.", "points": 1 },
          { "text": "No, I just test manually by clicking around.", "points": 0 }
        ]
      },
      {
        "id": "cs6",
        "question": "Have you built a project that successfully consumes and handles data from a third-party REST or GraphQL API?",
        "options": [
          { "text": "Yes, handled fetching, loading states, and errors.", "points": 3 },
          { "text": "I've followed a tutorial to do it once.", "points": 1 },
          { "text": "No.", "points": 0 }
        ]
      },
      {
        "id": "cs7",
        "question": "Are you deeply proficient in at least one modern, in-demand framework (e.g., React, Node, Spring Boot)?",
        "options": [
          { "text": "Yes, I am a specialist in one stack.", "points": 3 },
          { "text": "I know a little bit of many languages, but no deep framework knowledge.", "points": 1 },
          { "text": "I only know basic syntax from university classes.", "points": 0 }
        ]
      }
    ],
    "Business & Management": [
      {
        "id": "bm1",
        "question": "Can you pull, clean, and analyze data to make a business decision using advanced Excel, SQL, or Tableau?",
        "options": [
          { "text": "Yes, I can drive decisions from raw data.", "points": 3 },
          { "text": "I know basic Excel formulas.", "points": 1 },
          { "text": "No, I struggle with data analysis.", "points": 0 }
        ]
      },
      {
        "id": "bm2",
        "question": "Do you actively track macroeconomic trends, inflation impacts, and industry news for your target sector?",
        "options": [
          { "text": "Daily/Weekly. I can discuss market trends confidently.", "points": 3 },
          { "text": "Occasionally, right before an interview.", "points": 1 },
          { "text": "Rarely.", "points": 0 }
        ]
      },
      {
        "id": "bm3",
        "question": "Can you condense a complex 20-page business report into a crisp, 1-page executive summary?",
        "options": [
          { "text": "Yes, I am excellent at concise business writing.", "points": 3 },
          { "text": "I can, but it takes me a long time and might be too detailed.", "points": 1 },
          { "text": "No, I tend to over-explain.", "points": 0 }
        ]
      },
      {
        "id": "bm4",
        "question": "Are you familiar with Agile/Scrum methodologies and tools like Jira, Asana, or Trello?",
        "options": [
          { "text": "Yes, I've managed projects using them.", "points": 3 },
          { "text": "I know the theory.", "points": 1 },
          { "text": "No.", "points": 0 }
        ]
      },
      {
        "id": "bm5",
        "question": "How comfortable are you solving live business case studies or 'guesstimates' during an interview?",
        "options": [
          { "text": "Very. I have a structured framework to approach them.", "points": 3 },
          { "text": "I can get through them, but my structure is weak.", "points": 1 },
          { "text": "I freeze up or haven't practiced them.", "points": 0 }
        ]
      },
      {
        "id": "bm6",
        "question": "Have you ever had to pitch an idea, sell a concept, or negotiate a compromise in a professional setting?",
        "options": [
          { "text": "Yes, successfully and documented.", "points": 3 },
          { "text": "Only in basic academic group projects.", "points": 1 },
          { "text": "No.", "points": 0 }
        ]
      },
      {
        "id": "bm7",
        "question": "Can you map out a basic customer journey or explain core metrics like CAC (Customer Acquisition Cost) and LTV?",
        "options": [
          { "text": "Yes, I understand core business metrics.", "points": 3 },
          { "text": "I've heard the terms but can't apply them.", "points": 1 },
          { "text": "No.", "points": 0 }
        ]
      }
    ],
    "Accounting & Finance": [
      {
        "id": "af1",
        "question": "Can you build a dynamic financial model (e.g., DCF, 3-statement model) from scratch?",
        "options": [
          { "text": "Yes, without looking at a template.", "points": 3 },
          { "text": "I can fill one out if given a template.", "points": 1 },
          { "text": "No.", "points": 0 }
        ]
      },
      {
        "id": "af2",
        "question": "How proficient are you with advanced Excel (XLOOKUP, PivotTables, Macros) or ERP systems?",
        "options": [
          { "text": "Highly proficient, I use shortcuts constantly.", "points": 3 },
          { "text": "I can use basic VLOOKUP and simple pivots.", "points": 1 },
          { "text": "Beginner level.", "points": 0 }
        ]
      },
      {
        "id": "af3",
        "question": "Are you up-to-date with current accounting standards (GAAP/IFRS) and recent major tax law changes?",
        "options": [
          { "text": "Yes, I track regulatory changes.", "points": 3 },
          { "text": "I know what I was taught in my textbook 2 years ago.", "points": 1 },
          { "text": "No.", "points": 0 }
        ]
      },
      {
        "id": "af4",
        "question": "In a recessive market, can you identify areas for corporate cost reduction without impacting core operations?",
        "options": [
          { "text": "Yes, I understand strategic cost analysis.", "points": 3 },
          { "text": "I understand the concept theoretically.", "points": 1 },
          { "text": "No.", "points": 0 }
        ]
      },
      {
        "id": "af5",
        "question": "Can you assess and articulate financial risks based on current economic conditions and interest rates?",
        "options": [
          { "text": "Yes, confidently.", "points": 3 },
          { "text": "Somewhat, but I might lack depth.", "points": 1 },
          { "text": "No.", "points": 0 }
        ]
      },
      {
        "id": "af6",
        "question": "Can you translate complex financial sheets into clear, visual dashboards for non-finance executives?",
        "options": [
          { "text": "Yes, I can present data visually and simply.", "points": 3 },
          { "text": "I can explain it, but my visualizations are messy.", "points": 1 },
          { "text": "No, I just hand over the spreadsheet.", "points": 0 }
        ]
      },
      {
        "id": "af7",
        "question": "Have you completed, or are you actively studying for, professional certifications (CPA, CFA, CMA)?",
        "options": [
          { "text": "Yes, passed parts or actively testing.", "points": 3 },
          { "text": "Planning to start soon.", "points": 1 },
          { "text": "No plans yet.", "points": 0 }
        ]
      }
    ],
    "Science": [
      {
        "id": "sc1",
        "question": "Are you proficient in statistical analysis tools (R, Python, SPSS) for interpreting complex experimental data?",
        "options": [
          { "text": "Yes, I code/run my own statistical models.", "points": 3 },
          { "text": "I can use basic Excel functions for stats.", "points": 1 },
          { "text": "No, I struggle with data interpretation.", "points": 0 }
        ]
      },
      {
        "id": "sc2",
        "question": "Do you have hands-on, unassisted experience with modern laboratory equipment and safety protocols?",
        "options": [
          { "text": "Yes, heavily experienced.", "points": 3 },
          { "text": "Only in guided university lab sessions.", "points": 1 },
          { "text": "Very little or mostly theoretical.", "points": 0 }
        ]
      },
      {
        "id": "sc3",
        "question": "Have you authored, co-authored, or assisted in writing research papers, technical reports, or grant proposals?",
        "options": [
          { "text": "Yes, published or submitted.", "points": 3 },
          { "text": "I've written extensive lab reports for grades.", "points": 1 },
          { "text": "No.", "points": 0 }
        ]
      },
      {
        "id": "sc4",
        "question": "Can you explain how your specific scientific knowledge translates into a commercial product or biotech solution?",
        "options": [
          { "text": "Yes, I understand the industry application.", "points": 3 },
          { "text": "Vaguely.", "points": 1 },
          { "text": "No, I only view it academically.", "points": 0 }
        ]
      },
      {
        "id": "sc5",
        "question": "Are you familiar with industry-standard compliance and quality assurance protocols (e.g., FDA regulations, ISO)?",
        "options": [
          { "text": "Yes, I understand QA/QC standards.", "points": 3 },
          { "text": "I've heard of them but don't know specifics.", "points": 1 },
          { "text": "No.", "points": 0 }
        ]
      },
      {
        "id": "sc6",
        "question": "How meticulously do you document your methodology to ensure your experiments are 100% reproducible?",
        "options": [
          { "text": "Extremely. My notes are audit-ready.", "points": 3 },
          { "text": "Decent, but someone else might need to ask me questions to replicate it.", "points": 1 },
          { "text": "Poorly.", "points": 0 }
        ]
      },
      {
        "id": "sc7",
        "question": "Have you collaborated on projects that required you to explain complex scientific concepts to non-scientists (like business or marketing)?",
        "options": [
          { "text": "Yes, I can communicate science simply.", "points": 3 },
          { "text": "I try, but I use too much jargon.", "points": 1 },
          { "text": "No.", "points": 0 }
        ]
      }
    ],
    "Engineering": [
      {
        "id": "eg1",
        "question": "Are you highly proficient in industry-standard design and simulation software (AutoCAD, SolidWorks, MATLAB, ANSYS)?",
        "options": [
          { "text": "Yes, I can design and simulate complex systems.", "points": 3 },
          { "text": "I can do basic modeling/drafting.", "points": 1 },
          { "text": "No, I rarely use the software.", "points": 0 }
        ]
      },
      {
        "id": "eg2",
        "question": "Do you understand how to integrate traditional mechanical/civil/electrical engineering with IoT, sensors, or automation?",
        "options": [
          { "text": "Yes, I understand 'smart' integration.", "points": 3 },
          { "text": "I know the theory but haven't done it.", "points": 1 },
          { "text": "No.", "points": 0 }
        ]
      },
      {
        "id": "eg3",
        "question": "Can you confidently apply green tech, energy efficiency, and sustainable design principles to your projects?",
        "options": [
          { "text": "Yes, it's a core part of my design process.", "points": 3 },
          { "text": "I consider it occasionally.", "points": 1 },
          { "text": "No.", "points": 0 }
        ]
      },
      {
        "id": "eg4",
        "question": "Do you understand how material shortages, costs, or supply chain bottlenecks impact your design choices?",
        "options": [
          { "text": "Yes, I design for manufacturability and cost.", "points": 3 },
          { "text": "I only design for function, not cost/supply.", "points": 1 },
          { "text": "No.", "points": 0 }
        ]
      },
      {
        "id": "eg5",
        "question": "Have you physically built, tested, and iterated on a hardware prototype, beyond just computer simulations?",
        "options": [
          { "text": "Yes, hands-on prototyping and iteration.", "points": 3 },
          { "text": "Built once for a class, but didn't iterate.", "points": 1 },
          { "text": "No, only theoretical or simulated.", "points": 0 }
        ]
      },
      {
        "id": "eg6",
        "question": "Are you familiar with the safety codes and structural/electrical standards required in your specific industry?",
        "options": [
          { "text": "Yes, I strictly adhere to industry codes.", "points": 3 },
          { "text": "I know they exist but look them up rarely.", "points": 1 },
          { "text": "No.", "points": 0 }
        ]
      },
      {
        "id": "eg7",
        "question": "Do you understand the end-to-end lifecycle of an engineering project, from initial CAD to manufacturing/construction?",
        "options": [
          { "text": "Yes, complete lifecycle awareness.", "points": 3 },
          { "text": "I only focus on my specific design phase.", "points": 1 },
          { "text": "No.", "points": 0 }
        ]
      }
    ]
  }
};
