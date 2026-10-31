import { Routes, Route } from 'react-router-dom';

// Page Imports
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Onboarding1 from './pages/Onboarding1';
import Onboarding2 from './pages/Onboarding2';
import Onboarding3 from './pages/Onboarding3';
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';

// Layout Wrapper Import
import AppLayout from './components/AppLayout';

export default function App() {
  return (
    <Routes>
      {/* =========================================================
          1. HEADER-ONLY ROUTES (HeaderBar visible, Navbar hidden)
          Used for public pages, authentication, and onboarding flows.
         ========================================================= */}
      <Route element={<AppLayout showNavbar={false} />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding-1" element={<Onboarding1 />} />
        <Route path="/onboarding-2" element={<Onboarding2 />} />
        <Route path="/onboarding-3" element={<Onboarding3 />} />
      </Route>

      {/* =========================================================
          2. FULL APPLICATION ROUTES (Both HeaderBar and Navbar visible)
          Used for core app screens like Dashboard and Scanner.
         ========================================================= */}
      <Route element={<AppLayout showNavbar={true} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scanner" element={<Scanner />} />

        {/* Placeholders for upcoming primary navigation tabs */}
        {/* <Route path="/community" element={<Community />} /> */}
        {/* <Route path="/activities" element={<Activities />} /> */}
        {/* <Route path="/settings" element={<Settings />} /> */}
      </Route>
    </Routes>
  );
}