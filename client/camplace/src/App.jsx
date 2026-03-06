import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Jobs from "./pages/Jobs.jsx";
import Forum from "./pages/Forum.jsx";
import Partners from "./pages/Partners.jsx";

// Placeholder components for other routes
const Login = () => <div className="py-20 text-center text-3xl font-bold">Login Page (Static Placeholder)</div>;
const Register = () => <div className="py-20 text-center text-3xl font-bold">Register Page (Static Placeholder)</div>;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="partners" element={<Partners />} />
          <Route path="forum" element={<Forum />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
