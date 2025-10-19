"use client";

import React, { useEffect, useState } from "react";

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

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

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
        className="relative z-50 w-full max-w-xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-5 md:p-6 max-h-[92vh] overflow-auto"
      >
        <div className="relative flex items-center justify-between mb-6">
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4">
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-200">Fundal</h3>
            </div>

            <div className="mt-2 md:mt-0 flex items-center gap-3">
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