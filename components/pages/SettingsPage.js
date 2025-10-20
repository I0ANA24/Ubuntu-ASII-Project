"use client";

import React, { useEffect, useState } from "react";
import useDraggableWindow from "@/hooks/useDraggableWindow";

const SettingsPage = ({ onClose }) => {
  const backgrounds = [
    "background1.jpg",
    "background2.jpg",
    "background3.jpg",
    "background4.jpg",
    "background5.jpg"
  ];

  const [bgIndex, setBgIndex] = useState(() => {
    try {
      const v = localStorage.getItem("selectedBgIndex");
      return v !== null ? parseInt(v, 10) : 0;
    } catch {
      return 0;
    }
  });

  // theme: true = black mode (default), false = white mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const v = localStorage.getItem("isDarkMode");
      return v === null ? true : v === "true";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const file = backgrounds[bgIndex] || backgrounds[0];
    const url = `${window.location.origin}/background/${file}`;
    const cssValue = `url("${url}")`;

    const targets = [
      document.documentElement,
      document.body,
      document.getElementById("__next"),
      document.querySelector("main"),
      document.getElementById("root"),
    ].filter(Boolean);

    targets.forEach((el) => {
      try {
        el.style.setProperty("background-image", cssValue, "important");
        el.style.setProperty("background-size", "cover", "important");
        el.style.setProperty("background-position", "center", "important");
        el.style.setProperty("background-repeat", "no-repeat", "important");
      } catch {
        // fallback
        el.style.backgroundImage = cssValue;
        el.style.backgroundSize = "cover";
        el.style.backgroundPosition = "center";
        el.style.backgroundRepeat = "no-repeat";
      }
    });

    try {
      localStorage.setItem("selectedBgIndex", String(bgIndex));
    } catch {}

    console.log("Applied background:", url);
  }, [bgIndex]);

  // apply theme (topbar background + date/time text color + bottombar background)
  useEffect(() => {
    const styleId = "asa-theme-overrides";

    const ensureStyleTag = () => {
      let s = document.getElementById(styleId);
      if (!s) {
        s = document.createElement("style");
        s.id = styleId;
        document.head.appendChild(s);
      }
      return s;
    };

    const applyTheme = (dark) => {
      const topbarBg = dark ? "#000000" : "#ffffff";
      const topbarText = dark ? "#ffffff" : "#000000";

      // set CSS variables on :root so components can use them in css
      try {
        document.documentElement.style.setProperty("--topbar-bg", topbarBg);
        document.documentElement.style.setProperty("--topbar-text", topbarText);
        document.documentElement.style.setProperty("--bottombar-bg", topbarBg);
        document.documentElement.style.setProperty("--bottombar-text", topbarText);
      } catch {}

      // Inject/replace a stylesheet with strong rules to override component classes
      const styleTag = ensureStyleTag();
      styleTag.innerHTML = `
:root {
  --topbar-bg: ${topbarBg};
  --topbar-text: ${topbarText};
  --bottombar-bg: ${topbarBg};
  --bottombar-text: ${topbarText};
}

/* Topbar */
header, .topbar, #topbar, nav, .top-bar, .app-topbar {
  background-color: var(--topbar-bg) !important;
  color: var(--topbar-text) !important;
  z-index: 50 !important;
}

/* Bottom bar */
footer, .bottombar, #bottombar, .bottom-bar, .app-bottombar {
  background-color: var(--bottombar-bg) !important;
  color: var(--bottombar-text) !important;
  z-index: 50 !important;
}

/* date/time selectors — many variants to cover different markup */
header .date, header .time,
.topbar .date, .topbar .time,
.date, .time, .datetime, .date-time, #time {
  color: var(--topbar-text) !important;
  z-index: 60 !important;
}
`;

      // Also set inline styles for immediate effect (fallback)
      // NOTE: do NOT change 'position' here to avoid breaking fixed/sticky bars
      const topbarSelectors = "header, .topbar, #topbar, nav, .top-bar, .app-topbar";
      document.querySelectorAll(topbarSelectors).forEach((el) => {
        try {
          el.style.setProperty("background-color", topbarBg, "important");
          el.style.setProperty("color", topbarText, "important");
          el.style.setProperty("z-index", "50", "important");
        } catch {
          el.style.backgroundColor = topbarBg;
          el.style.color = topbarText;
          el.style.zIndex = "50";
        }
      });

      const bottombarSelectors = "footer, .bottombar, #bottombar, .bottom-bar, .app-bottombar";
      document.querySelectorAll(bottombarSelectors).forEach((el) => {
        try {
          el.style.setProperty("background-color", topbarBg, "important");
          el.style.setProperty("color", topbarText, "important");
          el.style.setProperty("z-index", "50", "important");
        } catch {
          el.style.backgroundColor = topbarBg;
          el.style.color = topbarText;
          el.style.zIndex = "50";
        }
      });

      const dateSelectors = "header .date, header .time, .topbar .date, .topbar .time, .date, .time, .datetime, .date-time, #time";
      document.querySelectorAll(dateSelectors).forEach((el) => {
        try {
          el.style.setProperty("color", topbarText, "important");
          el.style.setProperty("z-index", "60", "important");
        } catch {
          el.style.color = topbarText;
          el.style.zIndex = "60";
        }
      });
    };

    applyTheme(isDarkMode);
    try {
      localStorage.setItem("isDarkMode", String(isDarkMode));
      window.dispatchEvent(new CustomEvent("asa:theme-changed", { detail: isDarkMode }));
    } catch {}
  }, [isDarkMode]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const { windowRef: panelRef, style: panelTransform, handlePointerDown: startDragging } =
    useDraggableWindow();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Backdrop */}
      <button
        aria-label="Close settings backdrop"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        ref={panelRef}
        style={panelTransform}
        className="relative z-50 w-full max-w-xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-5 md:p-6 max-h-[92vh] overflow-auto"
      >
        <div
          className="relative flex items-center justify-between mb-6 cursor-move"
          onPointerDown={startDragging}
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Setări</h2>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="group absolute -right-3 -top-2 z-10 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <span className="sr-only">Închide</span>

            {/* default icon */}
            <img
              src="/icons/exit.png"
              alt="exit"
              className="h-6 w-6 block group-hover:hidden"
            />

            {/* hover/selected icon */}
            <img
              src="/icons/exit-OnSelect.png"
              alt="exit hover"
              className="h-6 w-6 hidden group-hover:block"
            />
          </button>
        </div>

        <section className="space-y-6">
          {/* Theme switch */}
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex-1">
              <h3 className="font-medium text-gray-800 dark:text-gray-200">Temă</h3>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={isDarkMode}
                aria-label="Comutator temă"
                onClick={() => setIsDarkMode((v) => !v)}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDarkMode ? "bg-gray-800" : "bg-gray-200"}`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${isDarkMode ? "translate-x-7" : "translate-x-1"}`}
                />
              </button>

              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {isDarkMode ? "Black" : "White"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex-1">
              <h3 className="font-medium text-gray-800 dark:text-gray-200">Fundal</h3>
            </div>

            <div className="flex items-center gap-3">
              {/* Prev */}
              <button
                onClick={() => setBgIndex((i) => (i - 1 + backgrounds.length) % backgrounds.length)}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                aria-label="Fundal anterior"
              >
                ◀
              </button>

              {/* thumbnail preview */}
              <div className="w-28 h-16 rounded overflow-hidden border">
                <img
                  src={`/background/${backgrounds[bgIndex]}`}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Next */}
              <button
                onClick={() => setBgIndex((i) => (i + 1) % backgrounds.length)}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                aria-label="Următorul fundal"
              >
                ▶
              </button>
            </div>
          </div>

          
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
