export const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-secret";
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
export const ADMIN_TOKEN_COOKIE = "adminToken";
export const STUDENT_TOKEN_COOKIE = "studentToken";

export const authCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production"
};
