import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Jobs from "./pages/Jobs.jsx";
import Forum from "./pages/Forum.jsx";
import Partners from "./pages/Partners.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="partners" element={<Partners />} />
            <Route path="forum" element={<Forum />} />
            <Route path="contact" element={<Contact />} />
            <Route path="login" element={<Navigate to="/" state={{ openAuth: 'login' }} />} />
            <Route path="register" element={<Navigate to="/" state={{ openAuth: 'register' }} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
