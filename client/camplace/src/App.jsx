import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Jobs from "./pages/Jobs.jsx";
import Forum from "./pages/Forum.jsx";
import Partners from "./pages/Partners.jsx";
import Profile from "./pages/Profile.jsx";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import StudentManagement from "./pages/admin/StudentManagement.jsx";
import JobManagement from "./pages/admin/JobManagement.jsx";
import ApplicationManagement from "./pages/admin/ApplicationManagement.jsx";
import PlacementRecords from "./pages/admin/PlacementRecords.jsx";
import ReportsAnalytics from "./pages/admin/ReportsAnalytics.jsx";
import AdminProfile from "./pages/admin/AdminProfile.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public & Student Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="partners" element={<Partners />} />
            <Route path="forum" element={<Forum />} />
            <Route path="contact" element={<Contact />} />
            <Route path="profile" element={<Profile />} />
            <Route path="login" element={<Navigate to="/" state={{ openAuth: 'login' }} />} />
            <Route path="register" element={<Navigate to="/" state={{ openAuth: 'register' }} />} />
          </Route>

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="students" element={<StudentManagement />} />
            <Route path="jobs" element={<JobManagement />} />
            <Route path="applications" element={<ApplicationManagement />} />
            <Route path="records" element={<PlacementRecords />} />
            <Route path="reports" element={<ReportsAnalytics />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
