import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Login from './pages/admin/Login';
import AdminLayout, { NoPermission } from './pages/admin/AdminLayout';
import Sales from './pages/admin/Sales';
import Products from './pages/admin/Products';
import Categories from './pages/admin/Categories';
import Users from './pages/admin/Users';
import DeliveryStatuses from './pages/admin/DeliveryStatuses';
import { can } from './auth';

// Opens the page only if the logged-in user has the permission
function Allow({ permission, children }) {
  return can(permission) ? children : <NoPermission />;
}

// First dashboard page: sales for admin, products for staff
function AdminHome() {
  return can('sales.view') ? <Sales /> : <Navigate to="/admin/products" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* website */}
      <Route path="/" element={<Home />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/success/:id" element={<Success />} />

      {/* dashboard */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminHome />} />
        <Route path="products" element={<Allow permission="products.add"><Products /></Allow>} />
        <Route path="categories" element={<Allow permission="categories.add"><Categories /></Allow>} />
        <Route path="shipping" element={<Allow permission="delivery.manage"><DeliveryStatuses /></Allow>} />
        <Route path="users" element={<Allow permission="users.manage"><Users /></Allow>} />
      </Route>
    </Routes>
  );
}
