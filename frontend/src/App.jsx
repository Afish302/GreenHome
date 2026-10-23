import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';

export default function App() {
  return (
    <Routes>
      {/* Landing page route */}
      <Route path="/" element={<Home />} />
      
      {/* Registration page route */}
      <Route path="/register" element={<Register />} />
      
      {/* Login placeholder route (until you create Login.jsx) */}
      <Route path="/login" element={<Register />} />
    </Routes>
  );
}