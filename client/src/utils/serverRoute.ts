export const LIVE_BASE_URL = "https://reddit-3m7o.onrender.com/graphql";

export const DEV_BASE_URL = "http://localhost:5000/graphql";

export const serverRoute = (env: string): string | undefined => {
  if (env === "production") {
    return LIVE_BASE_URL;
  } else if (env === "development") {
    return DEV_BASE_URL;
  }

  return;
};
