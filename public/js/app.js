const USERS_KEY = "users";
const USER_KEY = "user";
const FEEDBACKS_KEY = "feedbacks";

const getStoredUser = async () => {
  try {
    const res = await fetch("/api/auth/me");
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

const getStoredStudent = async () => {
  try {
    const res = await fetch("/api/auth/student-me");
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

const getFeedbacks = async () => {
  try {
    const res = await fetch("/api/feedbacks");
    if (!res.ok) return [];
    const data = await res.json();
    return data.map(item => ({ ...item, id: item._id }));
  } catch {
    return [];
  }
};

const saveFeedback = async (feedbackData) => {
  try {
    await fetch("/api/feedbacks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(feedbackData)
    });
  } catch (err) {
    console.error(err);
  }
};

const deleteFeedback = async (id) => {
  try {
    await fetch(`/api/feedbacks/${id}`, { method: "DELETE" });
  } catch (err) {
    console.error(err);
  }
};

const clearFeedbacks = async () => {
  try {
    await fetch("/api/feedbacks", { method: "DELETE" });
  } catch (err) {
    console.error(err);
  }
};

const seedFeedbacks = async () => {
  const seed = [
    {
      course: "Math 201",
      message: "Clear examples, pacing felt just right.",
      rating: 5,
    },
    {
      course: "History 110",
      message: "Loved the discussion prompts, more time for Q&A would help.",
      rating: 4,
    },
    {
      course: "Biology 150",
      message: "Labs are engaging, wish the slides were posted earlier.",
      rating: 4,
    },
    {
      course: "Math 201",
      message: "Challenging but supportive. The review sheets help a lot.",
      rating: 5,
    },
    {
      course: "Chemistry 101",
      message: "Would love more real-world examples in lectures.",
      rating: 3,
    }
  ];

  for (const item of seed) {
    await saveFeedback(item);
  }
  return await getFeedbacks();
};

const exportFeedbacksToCsv = (feedbacks) => {
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

const showToast = (message) => {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.hidden = true;
  }, 2400);
};

const setText = (id, value) => {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
};

const setHidden = (id, hidden) => {
  const element = document.getElementById(id);
  if (element) {
    element.hidden = hidden;
  }
};

const escapeHtml = (text) =>
  String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const markActiveNav = () => {
  document.querySelectorAll(".nav-link").forEach((link) => {
    const target = link.getAttribute("data-nav");
    if (target === window.location.pathname) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
};

const initNavbar = async () => {
  const user = await getStoredUser();
  const navUser = document.getElementById("navUserEmail");
  if (navUser) {
    navUser.textContent = user?.email || "Admin";
  }

  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/admin/login";
    });
  }

  const studentLogoutButton = document.getElementById("studentLogoutButton");
  if (studentLogoutButton) {
    studentLogoutButton.addEventListener("click", async () => {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/";
    });
  }

  markActiveNav();
};

const initLogin = async () => {
  const user = await getStoredUser();
  if (user) {
    window.location.href = "/admin";
    return;
  }

  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");
  const error = document.getElementById("loginError");


  if (!form || !emailInput || !passwordInput || !error) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    error.hidden = true;

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        error.textContent = data.error || "Login failed.";
        error.hidden = false;
        return;
      }

      window.location.href = "/admin";
    } catch (err) {
      error.textContent = "Server error. Try again.";
      error.hidden = false;
    }
  });

  initializeGoogleSignIn();
};

const initStudentLogin = async () => {
  const student = await getStoredStudent();
  if (student) {
    window.location.href = "/feedback";
    return;
  }

  const form = document.getElementById("studentLoginForm");
  const emailInput = document.getElementById("studentLoginEmail");
  const passwordInput = document.getElementById("studentLoginPassword");
  const error = document.getElementById("studentLoginError");

  if (!form || !emailInput || !passwordInput || !error) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    error.hidden = true;

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    try {
      const res = await fetch("/api/auth/student-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        error.textContent = data.error || "Login failed.";
        error.hidden = false;
        return;
      }

      window.location.href = "/feedback";
    } catch (err) {
      error.textContent = "Server error. Try again.";
      error.hidden = false;
    }
  });

  initializeGoogleSignIn();
};

const initStudentSignup = () => {
  const form = document.getElementById("studentSignupForm");
  const emailInput = document.getElementById("studentSignupEmail");
  const passwordInput = document.getElementById("studentSignupPassword");
  const picInput = document.getElementById("studentSignupPic");
  const error = document.getElementById("studentSignupError");
  const success = document.getElementById("studentSignupSuccess");

  if (!form || !emailInput || !passwordInput || !error || !success) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    error.hidden = true;
    success.hidden = true;

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if (password.length < 6) {
      error.textContent = "Password must be at least 6 characters.";
      error.hidden = false;
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    if (picInput && picInput.files[0]) {
      formData.append("profilePic", picInput.files[0]);
    }

    try {
      const res = await fetch("/api/auth/student-signup", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        error.textContent = data.error || "Signup failed.";
        error.hidden = false;
        return;
      }

      success.textContent = "Account created successfully. You can now log in.";
      success.hidden = false;
      form.reset();
    } catch (err) {
      error.textContent = "Server error. Try again.";
      error.hidden = false;
    }
  });
};

const initializeGoogleSignIn = () => {
  const googleButton = document.getElementById("googleSignInButton");
  const meta = document.querySelector('meta[name="google-client-id"]');
  if (!googleButton || !meta) return;

  const clientId = meta.getAttribute("content");
  if (!clientId || clientId === "YOUR_GOOGLE_CLIENT_ID_HERE") return;

  window.handleGoogleCallback = async (response) => {
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential })
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Google login failed.");
        return;
      }

      if (data.role === "student") {
        window.location.href = "/feedback";
      } else {
        window.location.href = "/admin";
      }
    } catch (err) {
      showToast("Server error during Google login.");
    }
  };

  if (window.google && window.google.accounts) {
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: window.handleGoogleCallback
    });
    window.google.accounts.id.renderButton(googleButton, {
      theme: "outline",
      size: "large",
      width: "100%"
    });
  } else {
    // If google script loads later
    window.onload = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: window.handleGoogleCallback
        });
        window.google.accounts.id.renderButton(googleButton, {
          theme: "outline",
          size: "large",
          width: "100%"
        });
      }
    };
  }
};



const createFeedbackListItem = (item, userRole) => {
  const deleteBtn = userRole === "admin" ? `<button class="button danger" type="button" data-delete-id="${item.id}">Delete</button>` : "";
  return `
    <div class="feedback-card" data-id="${item.id}">
      <div class="feedback-head">
        <div>
          <h3>${escapeHtml(item.name || "Anonymous student")}</h3>
          <p class="muted">${escapeHtml(item.course)}</p>
        </div>
        <span class="pill">${item.rating} / 5</span>
      </div>
      <p class="feedback-message">${escapeHtml(item.message)}</p>
      ${deleteBtn}
    </div>
  `;
};

const initFeedbackPage = async () => {
  const user = await getStoredUser();
  const userRole = user?.role || "admin";

  const form = document.getElementById("feedbackForm");
  const courseInput = document.getElementById("feedbackCourse");
  const messageInput = document.getElementById("feedbackMessage");
  const ratingSelect = document.getElementById("feedbackRating");
  const page = document.body.dataset.page;
  const isAdminView = page === "feedback-admin";

  if (!isAdminView && (!form || !courseInput || !messageInput || !ratingSelect)) return;

  // Handle student profile picture upload
  if (!isAdminView) {
    const profilePicInput = document.getElementById("studentProfilePicInput");
    const uploadBtn = document.getElementById("studentUploadProfilePicBtn");
    const uploadMsg = document.getElementById("studentUploadProfilePicMsg");
    
    if (uploadBtn && profilePicInput) {
      uploadBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        if (!profilePicInput.files[0]) {
          if (uploadMsg) {
            uploadMsg.textContent = "Please select an image file";
            uploadMsg.hidden = false;
          }
          return;
        }
        
        const formData = new FormData();
        formData.append("profilePic", profilePicInput.files[0]);
        
        try {
          const res = await fetch("/api/auth/student-upload-pic", {
            method: "POST",
            body: formData
          });
          
          const data = await res.json();
          if (res.ok) {
            if (uploadMsg) {
              uploadMsg.textContent = "Profile picture updated successfully!";
              uploadMsg.hidden = false;
            }
            profilePicInput.value = "";
            // Reload to show the new picture
            setTimeout(() => window.location.reload(), 1500);
          } else {
            if (uploadMsg) {
              uploadMsg.textContent = data.error || "Upload failed";
              uploadMsg.hidden = false;
            }
          }
        } catch (err) {
          if (uploadMsg) {
            uploadMsg.textContent = "Error uploading image";
            uploadMsg.hidden = false;
          }
        }
      });
    }
  }

  if (ratingSelect) {
    ratingSelect.innerHTML = [5, 4, 3, 2, 1]
      .map((value) => `<option value="${value}">${value}</option>`)
      .join("");
  }

  let feedbacks = await getFeedbacks();

  const sortSelect = document.getElementById("feedbackSort");
  const courseFilter = document.getElementById("filterCourse");
  const minRating = document.getElementById("filterMinRating");
  const maxRating = document.getElementById("filterMaxRating");
  const startDate = document.getElementById("filterStartDate");
  const endDate = document.getElementById("filterEndDate");
  const keywordInput = document.getElementById("filterKeyword");

  if (isAdminView) {
    if (minRating) {
      minRating.innerHTML = [1, 2, 3, 4, 5]
        .map((value) => `<option value="${value}">${value}</option>`)
        .join("");
      minRating.value = "1";
    }

    if (maxRating) {
      maxRating.innerHTML = [1, 2, 3, 4, 5]
        .map((value) => `<option value="${value}">${value}</option>`)
        .join("");
      maxRating.value = "5";
    }
  }

  const getFilteredFeedbacks = () => {
    if (!isAdminView) return [...feedbacks];

    const selectedCourse = courseFilter?.value || "all";
    const min = Number(minRating?.value || "1");
    const max = Number(maxRating?.value || "5");
    const start = startDate?.value ? new Date(`${startDate.value}T00:00:00`).getTime() : null;
    const end = endDate?.value ? new Date(`${endDate.value}T23:59:59`).getTime() : null;
    const normalizedKeyword = (keywordInput?.value || "").trim().toLowerCase();

    const filtered = feedbacks.filter((item) => {
      if (selectedCourse !== "all" && item.course !== selectedCourse) return false;
      if (item.rating < min || item.rating > max) return false;

      if (normalizedKeyword) {
        const matches =
          item.course.toLowerCase().includes(normalizedKeyword) ||
          item.message.toLowerCase().includes(normalizedKeyword);
        if (!matches) return false;
      }

      if (start || end) {
        const itemTime = item.createdAt ? new Date(item.createdAt).getTime() : item.id;
        if (start && itemTime < start) return false;
        if (end && itemTime > end) return false;
      }

      return true;
    });

    if (sortSelect?.value === "rating") {
      return [...filtered].sort((a, b) => b.rating - a.rating);
    }

    return filtered;
  };

  const updateCourseFilterOptions = () => {
    if (!courseFilter) return;
    const names = [...new Set(feedbacks.map((item) => item.course))].sort();
    const current = courseFilter.value || "all";
    const options = ["all", ...names];
    courseFilter.innerHTML = options
      .map((name) => `<option value="${escapeHtml(name)}">${name === "all" ? "All" : escapeHtml(name)}</option>`)
      .join("");
    courseFilter.value = options.includes(current) ? current : "all";
  };

  const renderFeedbackList = () => {
    if (!isAdminView) return;

    updateCourseFilterOptions();
    const list = document.getElementById("feedbackList");
    const filtered = getFilteredFeedbacks();

    setText("feedbackTotalCount", String(feedbacks.length));
    setText("feedbackShowingText", `Showing ${filtered.length} of ${feedbacks.length} entries.`);

    if (!list) return;

    if (!filtered.length) {
      list.innerHTML = `
        <div class="empty-state">
          <p class="empty-title">No matches yet</p>
          <p class="muted">Try a different name or course keyword.</p>
        </div>
      `;
      return;
    }

    list.innerHTML = filtered.map(item => createFeedbackListItem(item, userRole)).join("");

    list.querySelectorAll("[data-delete-id]").forEach((button) => {
      button.addEventListener("click", async () => {
        const id = button.getAttribute("data-delete-id");
        await deleteFeedback(id);
        feedbacks = await getFeedbacks();
        renderFeedbackList();
        showToast("Feedback removed.");
      });
    });
  };

  if (form && courseInput && messageInput && ratingSelect) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const course = courseInput.value.trim();
      const message = messageInput.value.trim();
      const rating = Number(ratingSelect.value);

      if (!course || !message) {
        showToast("Please fill all required fields.");
        return;
      }

      if (course.includes("@")) {
        showToast("Please enter a valid course name, not an email address.");
        return;
      }

      await saveFeedback({ course, message, rating });
      feedbacks = await getFeedbacks();
      
      showToast("Feedback saved successfully.");
      form.reset();
      ratingSelect.value = "5";
      renderFeedbackList();
    });
  }

  if (isAdminView) {
    [sortSelect, courseFilter, minRating, maxRating, startDate, endDate, keywordInput].forEach((element) => {
      if (!element) return;
      element.addEventListener("input", () => {
        if (Number(minRating?.value || 1) > Number(maxRating?.value || 5) && maxRating) {
          maxRating.value = minRating.value;
        }
        renderFeedbackList();
      });
      element.addEventListener("change", () => {
        if (Number(minRating?.value || 1) > Number(maxRating?.value || 5) && maxRating) {
          maxRating.value = minRating.value;
        }
        renderFeedbackList();
      });
    });

    const exportButton = document.getElementById("exportCsvButton");
    const seedButton = document.getElementById("seedDataButton");
    const clearAllButton = document.getElementById("clearAllFeedbackButton");
    const clearFiltersButton = document.getElementById("clearFiltersButton");

    if (userRole !== "admin") {
      if (seedButton) seedButton.style.display = "none";
      if (clearAllButton) clearAllButton.style.display = "none";
    }

    if (exportButton) {
      exportButton.addEventListener("click", () => {
        if (feedbacks.length === 0) {
          showToast("No feedback to export.");
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
        showToast("Export started.");
      });
    }

    if (seedButton) {
      seedButton.addEventListener("click", async () => {
        feedbacks = await seedFeedbacks();
        renderFeedbackList();
        showToast("Demo feedback added.");
      });
    }

    if (clearAllButton) {
      clearAllButton.addEventListener("click", async () => {
        if (!window.confirm("Clear all feedback? This cannot be undone.")) {
          return;
        }

        await clearFeedbacks();
        feedbacks = [];
        renderFeedbackList();
        showToast("All feedback cleared.");
      });
    }

    if (clearFiltersButton) {
      clearFiltersButton.addEventListener("click", () => {
        if (courseFilter) courseFilter.value = "all";
        if (minRating) minRating.value = "1";
        if (maxRating) maxRating.value = "5";
        if (startDate) startDate.value = "";
        if (endDate) endDate.value = "";
        if (keywordInput) keywordInput.value = "";
        if (sortSelect) sortSelect.value = "recent";
        renderFeedbackList();
        showToast("Filters cleared.");
      });
    }

    renderFeedbackList();
  }
};

const initDashboard = async () => {
  const user = await getStoredUser();
  const userRole = user?.role || "admin";

  const getSummary = async () => {
    const feedbacks = await getFeedbacks();
    const total = feedbacks.length;
    const average =
      total === 0 ? "0" : (feedbacks.reduce((sum, item) => sum + item.rating, 0) / total).toFixed(1);
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

    return { feedbacks, total, average, uniqueCourses, last7, topCourses, recent };
  };

  const render = async () => {
    const { total, average, uniqueCourses, last7, topCourses, recent } = await getSummary();

    setText("dashboardAvgRating", average);
    setText("dashboardAvgSubtitle", `Across ${total} responses`);
    setText("dashboardTotalFeedback", String(total));
    setText("dashboardActiveCourses", String(uniqueCourses));
    setText("dashboardLast7", `${last7} feedback entries in the last 7 days.`);

    const topCoursesList = document.getElementById("dashboardTopCourses");
    const recentList = document.getElementById("dashboardRecentFeedback");

    setHidden("dashboardTopCoursesEmpty", topCourses.length > 0);
    setHidden("dashboardRecentEmpty", recent.length > 0);

    if (topCoursesList) {
      topCoursesList.innerHTML = topCourses
        .map(
          (item) => `
            <li class="list-row">
              <span class="list-title">${escapeHtml(item.course)}</span>
              <span class="pill">${item.count} entries</span>
            </li>
          `
        )
        .join("");
    }

    if (recentList) {
      recentList.innerHTML = recent
        .map(
          (item) => `
            <li>
              <div class="list-row">
                <span class="list-title">Anonymous student</span>
                <span class="pill">${item.rating} / 5</span>
              </div>
              <p class="muted">${escapeHtml(item.course)}</p>
            </li>
          `
        )
        .join("");
    }
  };

  const seedButton = document.getElementById("dashboardSeedButton");
  const clearAllButton = document.getElementById("dashboardClearAllButton");

  if (userRole !== "admin") {
    if (seedButton) seedButton.style.display = "none";
    if (clearAllButton) clearAllButton.style.display = "none";
  }

  if (seedButton) {
    seedButton.addEventListener("click", async () => {
      await seedFeedbacks();
      await render();
      showToast("Demo feedback added.");
    });
  }

  if (clearAllButton) {
    clearAllButton.addEventListener("click", async () => {
      if (!window.confirm("Clear all feedback? This cannot be undone.")) {
        return;
      }
      await clearFeedbacks();
      await render();
      showToast("All feedback cleared.");
    });
  }

  await render();
};

const createSvgElement = (tag, attrs = {}) => {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.entries(attrs).forEach(([key, value]) => {
    element.setAttribute(key, String(value));
  });
  return element;
};

const initAnalytics = async () => {
  const feedbacks = await getFeedbacks();
  const total = feedbacks.length;
  const average = total === 0 ? "0" : (feedbacks.reduce((sum, item) => sum + item.rating, 0) / total).toFixed(1);
  const ratingCount = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: feedbacks.filter((item) => item.rating === rating).length
  }));
  const maxCount = Math.max(1, ...ratingCount.map((item) => item.count));

  const courseCounts = Object.values(
    feedbacks.reduce((acc, item) => {
      acc[item.course] = acc[item.course] || { course: item.course, count: 0 };
      acc[item.course].count += 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const maxCourseCount = Math.max(1, ...courseCounts.map((item) => item.count));

  const recentRatings = [...feedbacks]
    .sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : a.id;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : b.id;
      return aTime - bTime;
    })
    .slice(-7)
    .map((item) => item.rating);

  setText("analyticsTotal", String(total));
  setText("analyticsAverage", average);
  setText("analyticsTrendLabel", `Last ${recentRatings.length} submissions.`);

  const barSvg = document.getElementById("analyticsBarSvg");
  if (barSvg) {
    barSvg.innerHTML = "";
    ratingCount.forEach((item, index) => {
      const barHeight = (item.count / maxCount) * 90;
      const x = 20 + index * 55;
      const y = 110 - barHeight;

      const group = createSvgElement("g");
      const rect = createSvgElement("rect", {
        x,
        y,
        width: 34,
        height: barHeight,
        rx: 10,
        class: "chart-bar"
      });
      const text = createSvgElement("text", {
        x: x + 17,
        y: 125,
        "text-anchor": "middle",
        class: "chart-label"
      });
      text.textContent = String(item.rating);

      group.append(rect, text);
      barSvg.append(group);
    });
  }

  const ratingBars = document.getElementById("analyticsRatingBars");
  if (ratingBars) {
    ratingBars.innerHTML = ratingCount
      .map(
        (item) => `
          <div class="bar-row">
            <span class="bar-label">${item.rating} / 5</span>
            <div class="bar-track">
              <div class="bar-fill" style="width: ${(item.count / maxCount) * 100}%"></div>
            </div>
            <span class="bar-count">${item.count}</span>
          </div>
        `
      )
      .join("");
  }

  const trend = document.getElementById("analyticsTrendChart");
  if (trend) {
    if (!recentRatings.length) {
      trend.innerHTML = '<p class="muted">Add feedback to see the trend.</p>';
    } else {
      const chartPoints = recentRatings.map((value, index) => {
        if (recentRatings.length === 1) return "150,60";
        const x = (index / (recentRatings.length - 1)) * 300;
        const y = 110 - ((value - 1) / 4) * 100;
        return `${x},${y}`;
      });

      trend.innerHTML = `
        <svg viewBox="0 0 320 140" role="img" aria-label="Ratings line chart">
          <polyline points="${chartPoints.join(" ")}" class="chart-line" fill="none"></polyline>
          ${chartPoints
            .map((point) => {
              const [x, y] = point.split(",");
              return `<circle cx="${x}" cy="${y}" r="4" class="chart-dot"></circle>`;
            })
            .join("")}
        </svg>
      `;
    }
  }

  const courseBars = document.getElementById("analyticsCourseBars");
  if (courseBars) {
    if (!courseCounts.length) {
      courseBars.innerHTML = '<p class="muted">No courses yet.</p>';
    } else {
      courseBars.innerHTML = courseCounts
        .map(
          (item) => `
            <div class="bar-row">
              <span class="bar-label">${escapeHtml(item.course)}</span>
              <div class="bar-track">
                <div class="bar-fill" style="width: ${(item.count / maxCourseCount) * 100}%"></div>
              </div>
              <span class="bar-count">${item.count}</span>
            </div>
          `
        )
        .join("");
    }
  }
};

const initProfile = async () => {
  const user = await getStoredUser();
  const feedbacks = await getFeedbacks();
  const recent = feedbacks.slice(-3).reverse();

  setText("profileEmail", user?.email || "Admin");
  setHidden("profileRecentEmpty", recent.length > 0);

  const list = document.getElementById("profileRecentFeedback");
  if (list) {
    list.innerHTML = recent
      .map(
        (item) => `
          <li>
            <div class="list-row">
              <span class="list-title">${escapeHtml(item.course)}</span>
              <span class="pill">${item.rating} / 5</span>
            </div>
            <p class="muted">${escapeHtml(item.message)}</p>
          </li>
        `
      )
      .join("");
  }
};

const initContact = () => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("contactName")?.value.trim();
    const email = document.getElementById("contactEmail")?.value.trim();
    const message = document.getElementById("contactMessage")?.value.trim();

    if (!name || !email || !message) {
      showToast("Please complete all required fields.");
      return;
    }

    form.reset();
    showToast("Thanks! We will reply within 2 business days.");
  });
};

const initNotFound = async () => {
  const user = await getStoredUser();
  const isAuthed = Boolean(user);

  setText(
    "notFoundHint",
    isAuthed
      ? "Return to the admin overview or go back."
      : "Return to the anonymous feedback form or go back."
  );

  const primary = document.getElementById("notFoundPrimary");
  const back = document.getElementById("notFoundBack");

  if (primary) {
    primary.textContent = isAuthed ? "Go to admin overview" : "Submit feedback";
    primary.addEventListener("click", () => {
      window.location.href = isAuthed ? "/admin" : "/";
    });
  }

  if (back) {
    back.addEventListener("click", () => {
      window.history.back();
    });
  }
};

const initPage = async () => {
  await initNavbar();

  const page = document.body.dataset.page;

  if (page === "student-login") initStudentLogin();
  if (page === "student-signup") initStudentSignup();
  if (page === "login") initLogin();

  if (page === "feedback-student") {
    const student = await getStoredStudent();
    if (!student) {
      window.location.href = "/";
      return;
    }
    await initFeedbackPage();
  }
  if (page === "feedback-admin") await initFeedbackPage();
  if (page === "dashboard") await initDashboard();
  if (page === "analytics") await initAnalytics();
  if (page === "profile") await initProfile();
  if (page === "contact") initContact();
  if (page === "not-found") initNotFound();
};

document.addEventListener("DOMContentLoaded", initPage);
