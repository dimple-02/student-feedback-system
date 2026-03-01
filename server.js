import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

const renderPage = (res, view, options = {}, status = 200) => {
  return res.status(status).render(`pages/${view}`, {
    title: "Student Feedback System",
    currentPath: "",
    ...options
  });
};

app.get("/", (req, res) => {
  renderPage(res, "feedback", { currentPath: "/", pageKey: "feedback-student" });
});

app.get("/contact", (req, res) => {
  renderPage(res, "contact", { currentPath: "/contact", pageKey: "contact" });
});

app.get("/admin/login", (req, res) => {
  renderPage(res, "login", { currentPath: "/admin/login", pageKey: "login" });
});

app.get("/admin/setup", (req, res) => {
  renderPage(res, "admin-setup", { currentPath: "/admin/setup", pageKey: "admin-setup" });
});

app.get("/admin", (req, res) => {
  renderPage(res, "dashboard", { currentPath: "/admin", pageKey: "dashboard" });
});

app.get("/admin/feedback", (req, res) => {
  renderPage(res, "feedback", { currentPath: "/admin/feedback", pageKey: "feedback-admin" });
});

app.get("/admin/analytics", (req, res) => {
  renderPage(res, "analytics", { currentPath: "/admin/analytics", pageKey: "analytics" });
});

app.get("/admin/profile", (req, res) => {
  renderPage(res, "profile", { currentPath: "/admin/profile", pageKey: "profile" });
});

app.use((req, res) => {
  renderPage(res, "not-found", { currentPath: req.path, pageKey: "not-found" }, 404);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
