import { getFeedbacks } from "../utils/feedbackStore";

export default function Analytics() {
  const feedbacks = getFeedbacks();
  const total = feedbacks.length;

  const avg =
    total === 0
      ? 0
      : (feedbacks.reduce((acc, f) => acc + f.rating, 0) / total).toFixed(1);

  const ratingCount = [5, 4, 3, 2, 1].map((r) => ({
    rating: r,
    count: feedbacks.filter((f) => f.rating === r).length
  }));

  const maxCount = Math.max(1, ...ratingCount.map((r) => r.count));

  const courseCounts = Object.values(
    feedbacks.reduce((acc, item) => {
      acc[item.course] = acc[item.course] || { course: item.course, count: 0 };
      acc[item.course].count += 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const maxCourseCount = Math.max(1, ...courseCounts.map((c) => c.count));

  const recentRatings = [...feedbacks]
    .sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : a.id;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : b.id;
      return aTime - bTime;
    })
    .slice(-7)
    .map((item) => item.rating);

  const chartPoints = recentRatings.map((value, index) => {
    if (recentRatings.length === 1) return "150,60";
    const x = (index / (recentRatings.length - 1)) * 300;
    const y = 110 - ((value - 1) / 4) * 100;
    return `${x},${y}`;
  });

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Analytics</p>
          <h1>Understand feedback patterns</h1>
          <p className="muted">Spot highs, dips, and overall sentiment.</p>
        </div>
      </header>

      <div className="grid-2">
        <div className="card">
          <span className="card-meta">Snapshot</span>
          <h2 className="card-title">Total feedback</h2>
          <p className="big-text">{total}</p>
          <p className="muted">All responses collected to date.</p>
        </div>
        <div className="card">
          <span className="card-meta">Snapshot</span>
          <h2 className="card-title">Average rating</h2>
          <p className="big-text">{avg}</p>
          <p className="muted">Based on a 5-point scale.</p>
        </div>
      </div>

      <div className="card chart-card">
        <div className="card-head">
          <div>
            <h2 className="card-title">Rating distribution</h2>
            <p className="muted">Compare sentiment at a glance.</p>
          </div>
          <span className="card-meta">Distribution</span>
        </div>
        <div className="chart">
          <svg viewBox="0 0 320 140" role="img" aria-label="Ratings bar chart">
            {ratingCount.map((item, index) => {
              const barHeight = (item.count / maxCount) * 90;
              const x = 20 + index * 55;
              const y = 110 - barHeight;
              return (
                <g key={item.rating}>
                  <rect
                    x={x}
                    y={y}
                    width="34"
                    height={barHeight}
                    rx="10"
                    className="chart-bar"
                  />
                  <text x={x + 17} y="125" textAnchor="middle" className="chart-label">
                    {item.rating}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="bars">
          {ratingCount.map((item) => (
            <div key={item.rating} className="bar-row">
              <span className="bar-label">{item.rating} / 5</span>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                />
              </div>
              <span className="bar-count">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card chart-card">
        <div className="card-head">
          <div>
            <h2 className="card-title">Recent rating trend</h2>
            <p className="muted">Last {recentRatings.length || 0} submissions.</p>
          </div>
          <span className="card-meta">Trend</span>
        </div>
        <div className="chart">
          {recentRatings.length === 0 ? (
            <p className="muted">Add feedback to see the trend.</p>
          ) : (
            <svg viewBox="0 0 320 140" role="img" aria-label="Ratings line chart">
              <polyline
                points={chartPoints.join(" ")}
                className="chart-line"
                fill="none"
              />
              {chartPoints.map((point, index) => {
                const [x, y] = point.split(",");
                return (
                  <circle
                    key={`${x}-${y}`}
                    cx={x}
                    cy={y}
                    r="4"
                    className="chart-dot"
                  />
                );
              })}
            </svg>
          )}
        </div>
      </div>

      <div className="card chart-card">
        <div className="card-head">
          <div>
            <h2 className="card-title">Top courses or teachers</h2>
            <p className="muted">Most feedback collected by course or teacher.</p>
          </div>
          <span className="card-meta">Leaders</span>
        </div>
        <div className="bars">
          {courseCounts.length === 0 ? (
            <p className="muted">No courses yet.</p>
          ) : (
            courseCounts.map((item) => (
              <div key={item.course} className="bar-row">
                <span className="bar-label">{item.course}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ width: `${(item.count / maxCourseCount) * 100}%` }}
                  />
                </div>
                <span className="bar-count">{item.count}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
