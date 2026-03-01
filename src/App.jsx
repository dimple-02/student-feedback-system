import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Feedback from "./pages/FeedbackForm";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import AdminSetup from "./pages/AdminSetup";
import Navbar from "./components/Navbar";
import { getStoredUser } from "./utils/storage";

const ProtectedRoute = ({ children }) => {
  const user = getStoredUser();
  return user ? children : <Navigate to="/admin/login" />;
};

const AdminLayout = () => {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Feedback />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/setup" element={<AdminSetup />} />

      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/feedback" element={<Feedback />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
