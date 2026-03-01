import { useMemo } from "react";
import { getFeedbacks } from "../utils/feedbackStore";
import { getStoredUser } from "../utils/storage";

export default function Profile() {
  const user = useMemo(() => {
    return getStoredUser();
  }, []);

  const feedbacks = getFeedbacks();
  const recent = feedbacks.slice(-3).reverse();

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Admin profile</p>
          <h1>Account overview</h1>
          <p className="muted">Manage access to anonymous feedback insights.</p>
        </div>
      </header>

      <div className="grid-2">
        <div className="card">
          <span className="card-meta">Admin</span>
          <h2 className="card-title">Signed in as</h2>
          <p className="big-text">{user?.email || "Admin"}</p>
          <p className="muted">Admin access is local to this browser.</p>
        </div>

        <div className="card">
          <span className="card-meta">Recent</span>
          <h2 className="card-title">Recent feedback</h2>
          {recent.length === 0 ? (
            <p className="muted">No feedback submissions yet.</p>
          ) : (
            <ul className="list">
              {recent.map((item) => (
                <li key={item.id}>
                  <div className="list-row">
                    <span className="list-title">{item.course}</span>
                    <span className="pill">{item.rating} / 5</span>
                  </div>
                  <p className="muted">{item.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
