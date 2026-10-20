const themeToggle = document.querySelector("#theme-toggle");
const themeToggleLabel = document.querySelector("#theme-toggle-label");
const themeToggleIcon = document.querySelector(".theme-toggle-icon");
const themeStorageKey = "indian-art-form-theme";

function getSavedTheme() {
  try {
    return window.localStorage.getItem(themeStorageKey);
  } catch (error) {
    console.warn("Unable to read the saved theme preference.", error);
    return null;
  }
}

function saveTheme(theme) {
  try {
    window.localStorage.setItem(themeStorageKey, theme);
  } catch (error) {
    console.warn("Unable to save the theme preference.", error);
  }
}

function applyTheme(theme) {
  const isLight = theme === "light";
  document.body.classList.toggle("light-mode", isLight);

  if (!themeToggle) return;

  themeToggle.setAttribute("aria-pressed", String(isLight));
  themeToggle.setAttribute(
    "aria-label",
    isLight ? "Switch to dark mode" : "Switch to light mode"
  );

  if (themeToggleLabel) {
    themeToggleLabel.textContent = isLight ? "Dark mode" : "Light mode";
  }

  if (themeToggleIcon) {
    themeToggleIcon.textContent = isLight ? "☾" : "☼";
  }
}

applyTheme(getSavedTheme() === "light" ? "light" : "dark");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("light-mode") ? "dark" : "light";
    applyTheme(nextTheme);
    saveTheme(nextTheme);
  });
}
