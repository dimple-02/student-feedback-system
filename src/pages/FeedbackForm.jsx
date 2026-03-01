import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FeedbackList from "./FeedbackList";
import Toast from "./Toast";
import {
  clearFeedbacks,
  exportFeedbacksToCsv,
  getFeedbacks,
  saveFeedbacks,
  seedFeedbacks
} from "../utils/feedbackStore";

export default function FeedbackForm() {
  const [course, setCourse] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [feedbacks, setFeedbacks] = useState([]);
  const [toast, setToast] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [courseFilter, setCourseFilter] = useState("all");
  const [minRating, setMinRating] = useState("1");
  const [maxRating, setMaxRating] = useState("5");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [keyword, setKeyword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const isAdminView = location.pathname.startsWith("/admin");

  useEffect(() => {
    setFeedbacks(getFeedbacks());
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (Number(minRating) > Number(maxRating)) {
      setMaxRating(minRating);
    }
  }, [minRating, maxRating]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!course || !message) {
      setToast("Please fill all required fields.");
      return;
    }

    const newFeedback = {
      id: Date.now(),
      name: "Anonymous",
      course,
      message,
      rating,
      createdAt: new Date().toISOString()
    };

    const next = [newFeedback, ...feedbacks];
    setFeedbacks(next);
    saveFeedbacks(next);
    setToast("Feedback saved successfully.");

    setCourse("");
    setMessage("");
    setRating(5);
  };

  const courseOptions = useMemo(() => {
    const names = new Set(feedbacks.map((item) => item.course));
    return ["all", ...Array.from(names).sort()];
  }, [feedbacks]);

  const filteredFeedbacks = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    const start = startDate ? new Date(`${startDate}T00:00:00`).getTime() : null;
    const end = endDate ? new Date(`${endDate}T23:59:59`).getTime() : null;

    return feedbacks.filter((item) => {
      if (courseFilter !== "all" && item.course !== courseFilter) {
        return false;
      }
      if (item.rating < Number(minRating) || item.rating > Number(maxRating)) {
        return false;
      }
      if (normalized) {
        const matches =
          item.course.toLowerCase().includes(normalized) ||
          item.message.toLowerCase().includes(normalized);
        if (!matches) return false;
      }
      if (start || end) {
        const itemTime = item.createdAt
          ? new Date(item.createdAt).getTime()
          : item.id;
        if (start && itemTime < start) return false;
        if (end && itemTime > end) return false;
      }
      return true;
    });
  }, [
    feedbacks,
    courseFilter,
    minRating,
    maxRating,
    keyword,
    startDate,
    endDate
  ]);

  const sortedFeedbacks = useMemo(() => {
    if (sortBy === "rating") {
      return [...filteredFeedbacks].sort((a, b) => b.rating - a.rating);
    }
    return filteredFeedbacks;
  }, [filteredFeedbacks, sortBy]);

  const handleDelete = (id) => {
    const next = feedbacks.filter((item) => item.id !== id);
    setFeedbacks(next);
    saveFeedbacks(next);
    setToast("Feedback removed.");
  };

  const handleExport = () => {
    if (feedbacks.length === 0) {
      setToast("No feedback to export.");
      return;
    }
    const csv = exportFeedbacksToCsv(feedbacks);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "student-feedback.csv";
    link.click();
    URL.revokeObjectURL(url);
    setToast("Export started.");
  };

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

  const handleClearFilters = () => {
    setCourseFilter("all");
    setMinRating("1");
    setMaxRating("5");
    setStartDate("");
    setEndDate("");
    setKeyword("");
    setToast("Filters cleared.");
  };

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Feedback</p>
          <h1>
            {isAdminView
              ? "Review anonymous submissions"
              : "Share anonymous feedback"}
          </h1>
          <p className="muted">
            {isAdminView
              ? "Filter, export, and review student sentiment."
              : "Your name is never collected. Focus on the course or teacher."}
          </p>
        </div>
        {isAdminView ? (
          <div className="hero-stat">
            <p className="hero-label">Total entries</p>
            <p className="hero-value">{feedbacks.length}</p>
            <p className="hero-sub">Stored locally in this browser</p>
          </div>
        ) : null}
      </header>

      {isAdminView ? (
        <div className="action-row">
          <div className="filters">
            <label className="field compact wide">
              <span>Keyword</span>
              <input
                placeholder="Search course, teacher, message"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </label>
            <label className="field compact">
              <span>Course or teacher</span>
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
              >
                {courseOptions.map((course) => (
                  <option key={course} value={course}>
                    {course === "all" ? "All" : course}
                  </option>
                ))}
              </select>
            </label>
            <label className="field compact">
              <span>Min rating</span>
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
            <label className="field compact">
              <span>Max rating</span>
              <select
                value={maxRating}
                onChange={(e) => setMaxRating(e.target.value)}
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
            <label className="field compact">
              <span>Start date</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>
            <label className="field compact">
              <span>End date</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
          </div>
          <div className="actions">
            <button className="button secondary" onClick={handleExport}>
              Export CSV
            </button>
            <button className="button ghost" onClick={handleSeed}>
              Seed demo data
            </button>
            <button className="button ghost" onClick={handleClearFilters}>
              Clear filters
            </button>
            <button className="button danger" onClick={handleClearAll}>
              Clear all
            </button>
          </div>
        </div>
      ) : null}

      <div className="grid-2">
        <form onSubmit={handleSubmit} className="card form">
          <div className="card-head">
            <h2 className="card-title">Submit anonymous feedback</h2>
            <span className="card-meta">Student form</span>
          </div>

          <label className="field">
            <span>Course or teacher</span>
            <input
              placeholder="Math 201 or Ms. Rivera"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
            />
          </label>

          <label className="field">
            <span>Feedback message</span>
            <textarea
              placeholder="Share what stood out and what could improve."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
            />
          </label>

          <label className="field">
            <span>Rating</span>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>

          <button className="button">Submit feedback</button>
        </form>

        {isAdminView ? (
          <div className="card">
            <div className="card-head">
              <div>
                <h2 className="card-title">All feedback</h2>
                <p className="muted">
                  Showing {sortedFeedbacks.length} of {feedbacks.length} entries.
                </p>
              </div>
              <span className="card-meta">Admin view</span>
              <label className="field compact">
                <span>Sort</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recent">Most recent</option>
                  <option value="rating">Highest rating</option>
                </select>
              </label>
            </div>
            <FeedbackList
              feedbacks={sortedFeedbacks}
              onDelete={handleDelete}
              query={keyword}
            />
          </div>
        ) : (
          <div className="card">
            <div className="card-head">
              <h2 className="card-title">What happens next</h2>
              <span className="card-meta">Student info</span>
            </div>
            <p className="muted">
              Submissions are anonymous. Admins review trends and feedback to
              improve course experiences.
            </p>
            <div className="actions">
              <button
                className="button ghost"
                type="button"
                onClick={() => navigate("/admin/setup")}
              >
                Admin setup
              </button>
            </div>
            <ul className="list">
              <li className="list-row">
                <span className="list-title">Anonymous by default</span>
                <span className="pill">No names saved</span>
              </li>
              <li className="list-row">
                <span className="list-title">Reviewed weekly</span>
                <span className="pill">Admin team</span>
              </li>
            </ul>
          </div>
        )}
      </div>
      <Toast message={toast} />
    </section>
  );
}
