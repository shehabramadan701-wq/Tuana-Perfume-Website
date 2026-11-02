import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/success/:id" element={<Success />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<Dashboard />} />
    </Routes>
  );
}
