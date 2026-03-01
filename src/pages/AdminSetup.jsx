import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredUsers, saveUsers } from "../utils/storage";

export default function AdminSetup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSetup = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const users = getStoredUsers();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter an email.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const exists = users.some((user) => user.email === normalizedEmail);

    if (exists) {
      setError("An admin account with this email already exists.");
      return;
    }

    users.push({ email: normalizedEmail, password });
    saveUsers(users);
    setSuccess("Admin account created. You can log in now.");
  };

  return (
    <section className="auth-shell">
      <form onSubmit={handleSetup} className="card auth-card">
        <div>
          <p className="eyebrow">Admin setup</p>
          <span className="card-meta">Local access</span>
          <h1>Create a local admin account</h1>
          <p className="muted">
            This is for demos only. Accounts are stored in this browser.
          </p>
        </div>

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            placeholder="admin@school.edu"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
            }}
            required
          />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
            }}
            required
          />
        </label>

        {error ? <p className="error-text">{error}</p> : null}
        {success ? <p className="muted">{success}</p> : null}

        <button className="button">Create admin account</button>
        <button
          type="button"
          className="button ghost"
          onClick={() => navigate("/admin/login")}
        >
          Back to login
        </button>
      </form>
    </section>
  );
}
