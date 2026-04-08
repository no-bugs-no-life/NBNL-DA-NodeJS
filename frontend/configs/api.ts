const SERVER_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  "http://localhost:3000";

export const API_URL = SERVER_API_URL;
