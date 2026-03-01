export const getStoredUsers = () => {
  const raw = localStorage.getItem("users");
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveUsers = (users) => {
  localStorage.setItem("users", JSON.stringify(users));
};

export const getStoredUser = () => {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
};

export const saveCurrentUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearCurrentUser = () => {
  localStorage.removeItem("user");
};
