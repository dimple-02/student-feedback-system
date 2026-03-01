const STORAGE_KEY = "feedbacks";

export const getFeedbacks = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveFeedbacks = (feedbacks) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbacks));
};

export const clearFeedbacks = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const seedFeedbacks = () => {
  const seed = [
    {
      id: Date.now() - 600000,
      name: "Anonymous",
      course: "Math 201",
      message: "Clear examples, pacing felt just right.",
      rating: 5,
      createdAt: new Date(Date.now() - 600000).toISOString()
    },
    {
      id: Date.now() - 420000,
      name: "Anonymous",
      course: "History 110",
      message: "Loved the discussion prompts, more time for Q&A would help.",
      rating: 4,
      createdAt: new Date(Date.now() - 420000).toISOString()
    },
    {
      id: Date.now() - 280000,
      name: "Anonymous",
      course: "Biology 150",
      message: "Labs are engaging, wish the slides were posted earlier.",
      rating: 4,
      createdAt: new Date(Date.now() - 280000).toISOString()
    },
    {
      id: Date.now() - 180000,
      name: "Anonymous",
      course: "Math 201",
      message: "Challenging but supportive. The review sheets help a lot.",
      rating: 5,
      createdAt: new Date(Date.now() - 180000).toISOString()
    },
    {
      id: Date.now() - 90000,
      name: "Anonymous",
      course: "Chemistry 101",
      message: "Would love more real-world examples in lectures.",
      rating: 3,
      createdAt: new Date(Date.now() - 90000).toISOString()
    }
  ];

  saveFeedbacks(seed);
  return seed;
};

export const exportFeedbacksToCsv = (feedbacks) => {
  const headers = ["id", "name", "course", "message", "rating", "createdAt"];
  const rows = feedbacks.map((item) =>
    [
      item.id,
      item.name,
      item.course,
      item.message,
      item.rating,
      item.createdAt || ""
    ]
      .map((value) => {
        const safe = String(value ?? "").replace(/"/g, '""');
        return `"${safe}"`;
      })
      .join(",")
  );

  return [headers.join(","), ...rows].join("\n");
};
