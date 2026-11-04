import { Routes, Route } from 'react-router-dom';

// Public & Authentication Pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';

// Onboarding Pages (commented out until files are created)
// import Onboarding1 from './pages/Onboarding1';
// import Onboarding2 from './pages/Onboarding2';
// import Onboarding3 from './pages/Onboarding3';

// Main Application Pages
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';

// Global Layout Wrapper
import AppLayout from './components/AppLayout';
import OnboardCommute from './pages/onboardCommute';
//import OnboardFood from './pages/onboardFood';
//import OnboardHouse from './pages/onboardHouse';

export default function App() {
  return (
    <Routes>
      {/* =========================================================
          1. HEADER-ONLY ROUTES (showNavbar={false})
          Top header bar is displayed, but bottom mobile navigation is hidden.
          Used for landing page, authentication, and onboarding flows.
         ========================================================= */}
      <Route element={<AppLayout showNavbar={false} />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/onboarding-1" element={<Onboarding1 />} />
        <Route path="/onboarding-2" element={<Onboarding2 />} />
        <Route path="/onboarding-3" element={<Onboarding3 />} /> */}
      </Route>

      {/* =========================================================
          2. FULL APPLICATION ROUTES (showNavbar={true})
          Both top header bar and bottom mobile navigation are displayed.
          Used for main app features (Dashboard, Scanner, Community, Settings).
         ========================================================= */}
      <Route element={<AppLayout showNavbar={true} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scanner" element={<Scanner />} />
      </Route>
    </Routes>
  );
}