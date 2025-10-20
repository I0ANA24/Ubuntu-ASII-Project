"use client";

export const parseThemePreference = (value) => {
  if (value === null || typeof value === "undefined") return true;
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return Boolean(value);
};

export const readThemePreference = () => {
  if (typeof window === "undefined") return true;
  try {
    const stored = window.localStorage.getItem("isDarkMode");
    return parseThemePreference(stored);
  } catch {
    return true;
  }
};

export const subscribeToThemePreference = (callback) => {
  if (typeof window === "undefined") return () => {};

  const onStorage = (event) => {
    if (event.key === "isDarkMode") {
      callback(parseThemePreference(event.newValue));
    }
  };

  const onThemeEvent = (event) => {
    if (typeof event.detail !== "undefined") {
      callback(parseThemePreference(event.detail));
    }
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener("asa:theme-changed", onThemeEvent);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("asa:theme-changed", onThemeEvent);
  };
};
