import { useEffect, useState } from "react";
import Toast from "./Toast";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("General question");
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name || !email || !message) {
      setToast("Please complete all required fields.");
      return;
    }

    setName("");
    setEmail("");
    setTopic("General question");
    setMessage("");
    setToast("Thanks! We will reply within 2 business days.");
  };

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Contact</p>
          <h1>Get in touch with the team</h1>
          <p className="muted">
            Send feedback, report an issue, or ask a question about the platform.
          </p>
        </div>
      </header>

      <div className="grid-2">
        <form onSubmit={handleSubmit} className="card form">
          <div className="card-head">
            <h2 className="card-title">Contact support</h2>
            <span className="card-meta">Support</span>
          </div>

          <label className="field">
            <span>Name</span>
            <input
              placeholder="Jordan Lee"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              placeholder="teacher@school.edu"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="field">
            <span>Topic</span>
            <select value={topic} onChange={(event) => setTopic(event.target.value)}>
              <option>General question</option>
              <option>Report a bug</option>
              <option>Feature request</option>
              <option>Data or privacy</option>
            </select>
          </label>

          <label className="field">
            <span>Message</span>
            <textarea
              placeholder="Share as much detail as you can."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={5}
              required
            />
          </label>

          <button className="button">Send message</button>
        </form>

        <div className="card">
          <div className="card-head">
            <h2 className="card-title">Support hours</h2>
            <span className="card-meta">Availability</span>
          </div>
          <p className="muted">
            Our team replies Monday to Friday, 9:00 AM to 5:00 PM local time.
          </p>
          <div className="list">
            <div className="list-row">
              <span className="list-title">Response time</span>
              <span className="pill">Within 2 days</span>
            </div>
            <div className="list-row">
              <span className="list-title">Priority issues</span>
              <span className="pill">Same day</span>
            </div>
          </div>
        </div>
      </div>
      <Toast message={toast} />
    </section>
  );
}
