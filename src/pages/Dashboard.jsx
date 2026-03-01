import { useEffect, useState } from "react";
import Toast from "./Toast";
import { clearFeedbacks, getFeedbacks, seedFeedbacks } from "../utils/feedbackStore";

export default function Dashboard() {
  const [feedbacks, setFeedbacks] = useState(getFeedbacks());
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  const total = feedbacks.length;
  const avg =
    total === 0
      ? 0
      : (feedbacks.reduce((sum, f) => sum + f.rating, 0) / total).toFixed(1);

  const uniqueCourses = new Set(feedbacks.map((item) => item.course)).size;
  const last7 = feedbacks.filter((item) => {
    const time = item.createdAt ? new Date(item.createdAt).getTime() : item.id;
    return Date.now() - time <= 7 * 24 * 60 * 60 * 1000;
  }).length;

  const topCourses = Object.values(
    feedbacks.reduce((acc, item) => {
      acc[item.course] = acc[item.course] || { course: item.course, count: 0 };
      acc[item.course].count += 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const recent = feedbacks.slice(-4).reverse();

  const handleSeed = () => {
    const next = seedFeedbacks();
    setFeedbacks(next);
    setToast("Demo feedback added.");
  };

  const handleClearAll = () => {
    const confirmed = window.confirm("Clear all feedback? This cannot be undone.");
    if (!confirmed) return;
    clearFeedbacks();
    setFeedbacks([]);
    setToast("All feedback cleared.");
  };

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Anonymous feedback at a glance</h1>
          <p className="muted">
            Track sentiment trends, top courses or teachers, and new submissions.
          </p>
        </div>
        <div className="hero-stat">
          <p className="hero-label">Average rating</p>
          <p className="hero-value">{avg}</p>
          <p className="hero-sub">Across {total} responses</p>
        </div>
      </header>

      <div className="grid-3">
        <div className="card">
          <span className="card-meta">All time</span>
          <h2 className="card-title">Total feedback</h2>
          <p className="big-text">{total}</p>
          <p className="muted">All-time submissions captured.</p>
        </div>
        <div className="card">
          <span className="card-meta">Distinct</span>
          <h2 className="card-title">Active courses</h2>
          <p className="big-text">{uniqueCourses}</p>
          <p className="muted">Distinct courses with feedback.</p>
        </div>
        <div className="card">
          <span className="card-meta">Leaders</span>
          <h2 className="card-title">Top courses or teachers</h2>
          {topCourses.length === 0 ? (
            <p className="muted">No courses yet. Add feedback to begin.</p>
          ) : (
            <ul className="list">
              {topCourses.map((item) => (
                <li key={item.course} className="list-row">
                  <span className="list-title">{item.course}</span>
                  <span className="pill">{item.count} entries</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <span className="card-meta">Recent</span>
          <h2 className="card-title">Latest feedback</h2>
          {recent.length === 0 ? (
            <p className="muted">Nothing here yet.</p>
          ) : (
            <ul className="list">
              {recent.map((item) => (
                <li key={item.id}>
                  <div className="list-row">
                    <span className="list-title">Anonymous student</span>
                    <span className="pill">{item.rating} / 5</span>
                  </div>
                  <p className="muted">{item.course}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="card">
          <span className="card-meta">Admin tools</span>
          <h2 className="card-title">Quick actions</h2>
          <p className="muted">{last7} feedback entries in the last 7 days.</p>
          <div className="actions">
            <button className="button secondary" onClick={handleSeed}>
              Seed demo data
            </button>
            <button className="button danger" onClick={handleClearAll}>
              Clear all feedback
            </button>
          </div>
        </div>
      </div>
      <Toast message={toast} />
    </section>
  );
}
