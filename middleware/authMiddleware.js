import jwt from "jsonwebtoken";
import { JWT_SECRET, ADMIN_TOKEN_COOKIE, STUDENT_TOKEN_COOKIE } from "../config/constants.js";

export const requireStudentAuth = (req, res, next) => {
  const token = req.cookies[STUDENT_TOKEN_COOKIE];
  if (!token) return res.redirect("/");
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "student") return res.redirect("/");
    req.student = decoded;
    next();
  } catch {
    res.redirect("/");
  }
};

export const requireAuth = (req, res, next) => {
  const token = req.cookies[ADMIN_TOKEN_COOKIE];
  if (!token) return res.redirect("/admin/login");
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.redirect("/admin/login");
  }
};
