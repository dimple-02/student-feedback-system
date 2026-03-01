export default function FeedbackList({ feedbacks, onDelete, query }) {
  const normalized = (query || "").toLowerCase();
  const filtered = normalized
    ? feedbacks.filter(
        (f) =>
          f.course.toLowerCase().includes(normalized) ||
          f.message.toLowerCase().includes(normalized)
      )
    : feedbacks;

  return (
    <div className="feedback-list">
      {filtered.length === 0 ? (
        <div className="empty-state">
          <p className="empty-title">No matches yet</p>
          <p className="muted">Try a different name or course keyword.</p>
        </div>
      ) : (
        filtered.map((f) => (
          <div key={f.id} className="feedback-card">
            <div className="feedback-head">
              <div>
                <h3>{f.name || "Anonymous student"}</h3>
                <p className="muted">{f.course}</p>
              </div>
              <span className="pill">{f.rating} / 5</span>
            </div>
            <p className="feedback-message">{f.message}</p>
            <button className="button danger" onClick={() => onDelete(f.id)}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}
