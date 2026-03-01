import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  const isAuthed = Boolean(localStorage.getItem("user"));

  const handlePrimary = () => {
    navigate(isAuthed ? "/admin" : "/");
  };

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Page not found</p>
          <h1>We could not find that page</h1>
          <p className="muted">
            The link might be broken or the page was moved.
          </p>
        </div>
      </header>

      <div className="card">
        <span className="card-meta">Navigation</span>
        <p className="muted">
          {isAuthed
            ? "Return to the admin overview or go back."
            : "Return to the anonymous feedback form or go back."}
        </p>
        <div className="actions">
          <button className="button" onClick={handlePrimary}>
            {isAuthed ? "Go to admin overview" : "Submit feedback"}
          </button>
          <button className="button ghost" onClick={() => navigate(-1)}>
            Go back
          </button>
        </div>
      </div>
    </section>
  );
}
