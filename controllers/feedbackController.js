import Feedback from "../models/Feedback.js";

export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch feedbacks" });
  }
};

export const submitFeedback = async (req, res) => {
  try {
    const { course, message, rating } = req.body;
    const newFeedback = new Feedback({ course, message, rating });
    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(500).json({ error: "Failed to save feedback" });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Only admins can delete feedback." });
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete feedback" });
  }
};

export const clearAllFeedbacks = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Only admins can clear feedback." });
    await Feedback.deleteMany({});
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to clear feedbacks" });
  }
};
