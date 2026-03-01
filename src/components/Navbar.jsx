import { NavLink, useNavigate } from "react-router-dom";
import { clearCurrentUser, getStoredUser } from "../utils/storage";

export default function Navbar() {
  const navigate = useNavigate();
  const user = getStoredUser();

  const logout = () => {
    clearCurrentUser();
    navigate("/admin/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="brand-mark">SF</span>
        <div>
          <p className="brand-title">Teacher Dashboard</p>
          <p className="brand-subtitle">Anonymous feedback insights</p>
        </div>
      </div>
      <div className="nav-links">
        <NavLink to="/admin" end className="nav-link">
          Overview
        </NavLink>
        <NavLink to="/admin/feedback" className="nav-link">
          Feedback
        </NavLink>
        <NavLink to="/admin/analytics" className="nav-link">
          Analytics
        </NavLink>
        <NavLink to="/admin/profile" className="nav-link">
          Profile
        </NavLink>
      </div>
      <div className="nav-actions">
        <span className="user-chip">{user?.email || "Admin"}</span>
        <button className="button ghost" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
