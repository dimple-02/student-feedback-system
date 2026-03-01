import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getStoredUser,
  getStoredUsers,
  saveCurrentUser
} from "../utils/storage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    const users = getStoredUsers();
    const normalizedEmail = email.trim().toLowerCase();

    if (!users.length) {
      setError("No admin accounts found on this device. Contact support.");
      return;
    }

    const user = users.find(
      (u) => (u.email || "").toLowerCase() === normalizedEmail
    );

    if (!user) {
      setError("No admin account for that email. Contact support.");
      return;
    }

    if (user.password !== password) {
      setError("Incorrect password. Try again.");
      return;
    }

    saveCurrentUser(user);
    navigate("/admin");
  };

  return (
    <section className="auth-shell">
      <form onSubmit={handleLogin} className="card auth-card">
        <div>
          <p className="eyebrow">Admin access</p>
          <span className="card-meta">Secure</span>
          <h1>Log in to the teacher dashboard</h1>
          <p className="muted">View anonymous feedback and analytics.</p>
        </div>

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            placeholder="admin@school.edu"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            required
          />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            required
          />
        </label>

        {error ? <p className="error-text">{error}</p> : null}
        <p className="muted">Admin accounts are stored only in this browser.</p>

        <button className="button">Log in</button>
        <button
          type="button"
          className="button ghost"
          onClick={() => navigate("/admin/setup")}
        >
          Create local admin account
        </button>
      </form>
    </section>
  );
}
