#  CamPlace - A Centralized Campus Placement and Job Management Platform.

**CamPlace** is a modern, real-time Campus Placement Management System designed to bridge the gap between students, placement cells, and top recruiting companies. Built on a robust MERN stack, it automates the recruitment pipeline, enforces institutional placement policies, and leverages AI to provide students with actionable career insights.

---

##  Key Features

###  For Students
*   **Centralized Command Center:** Track all job applications, shortlists, and upcoming interviews in one place.
*   **Digital Resume & Profile:** Maintain an up-to-date academic profile, CGPA, skills, and projects that admins can instantly review.
*   **Real-time Notifications:** Get instant updates via Socket.io when an application status changes (e.g., Shortlisted, Selected).
*   **AI-Powered Career Coaching:** Uses **Google Gemini AI** to provide brutally honest, data-driven feedback on application momentum and funnel efficiency.
*   **Mock Interview Quizzes:** Department-specific assessments with personalized, AI-generated insights to pinpoint weaknesses.
*   **Curated Interview Resources:** Access college-approved technical guides, aptitude tests, HR preparation materials, and resume templates.

###  For Administrators (Placement Cell)
*   **Live Analytics Dashboard:** Real-time metrics on placement success rates, stage-wise rejections, and top hiring companies.
*   **Job Broadcasting:** Instantly post jobs and broadcast notifications to eligible students campus-wide.
*   **Application Kanban/Table Pipeline:** Seamlessly move candidates through stages (Applied → Shortlisted → Interview → Selected).
*   **One-Student-One-Job Lock:** Systematically enforces institutional fairness by automatically disabling further placement options for a student once they are marked as "SELECTED".
*   **Smart Reminders (Cron Jobs):** Automated background tasks send schedule reminders to students on the morning of their interviews.
*   **AI Strategic Insights:** Admin-specific Gemini AI analysis to identify pipeline bottlenecks, market alignment, and strategic opportunities for the placement season.

---

##  Tech Stack

**Frontend:**
*   **React 18** (via Vite)
*   **Tailwind CSS** (for modern, responsive styling)
*   **Framer Motion** (for fluid UI animations)
*   **Lucide React** (Iconography)

**Backend:**
*   **Node.js & Express.js**
*   **MongoDB** (via Mongoose)
*   **Socket.io** (Real-time bidirectional event-based communication)
*   **JWT & bcryptjs** (Secure authentication, 1-hour session expiry)
*   **Google Gemini AI SDK** (Multi-model fallback: Gemini 3.1 Flash Lite -> 2.5 Flash -> 1.5 Flash)
*   **Node-cron & Nodemailer** (Automated job scheduling and email notifications)

---

## ⚙️ Local Setup & Installation

### 1. Prerequisites
*   [Node.js](https://nodejs.org/) (v16 or higher)
*   [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)
*   Google Gemini API Key

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/camplace.git
cd camplace
```

### 3. Install Dependencies
Assuming a standard unified structure (if your frontend and backend are split, run `npm install` in both directories):
```bash
npm install
```

### 4. Environment Variables
Create a `.env` file in the root directory (or your server directory) and add the following keys:
```env
# Server Configuration
PORT=3000
NODE_ENV=development
APP_URL=http://localhost:3000

# Database
MONGODB_URI=your_mongodb_connection_string

# Security
JWT_SECRET=your_super_secret_jwt_key

# External APIs
GEMINI_API_KEY=your_google_gemini_api_key

# Email Configuration (Nodemailer)
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password
```

### 5. Run the Application
Start the development server (which concurrently runs both the Express backend and Vite frontend):
```bash
npm run dev
```
The app will be running at `http://localhost:3000`.

---

##  AI Model Fallback Architecture
CamPlace uses a robust, highly-available AI implementation to ensure students and admins always receive their career insights, even during high API demand.
*   **Primary:** `gemini-3.1-flash-lite-preview` (Fastest, latest)
*   **Fallback 1:** `gemini-2.5-flash`
*   **Fallback 2:** `gemini-1.5-flash`
If the primary model is throttled (503 Error), the system automatically attempts the fallbacks, guaranteeing an uninterrupted user experience.

---

##  Contributing
Contributions, issues, and feature requests are welcome! 
Feel free to check out the [issues page](https://github.com/your-username/camplace/issues) if you want to contribute.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License
This project is licensed under the MIT License.

---

##   Contact

Rishi Gehani - rishigehani18@gmail.com
