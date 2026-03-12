// Backend base URL used across the app.
// - If VITE_API_URL is set, that wins (for deployed environments).
// - Otherwise, always fall back to local FastAPI dev server.
export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";
