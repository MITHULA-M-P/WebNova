import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';

const AdminRoutes = () => (
  <Routes>
    <Route path="/admin/login" element={<Login />} />
    <Route path="/admin/dashboard" element={<Dashboard />} />
    <Route path="*" element={<Navigate to="/admin/login" replace />} />
  </Routes>
);

export default AdminRoutes;
