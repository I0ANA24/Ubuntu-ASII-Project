"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const backgrounds = [
      "background1.jpg",
      "background2.jpg",
      "background3.jpg",
      "background4.jpg",
      "background5.jpg",
    ];

    let file = backgrounds[0];
    try {
      const idx = localStorage.getItem("selectedBgIndex");
      if (idx !== null && backgrounds[Number(idx)]) file = backgrounds[Number(idx)];
    } catch {}

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
        el.style.backgroundImage = cssValue;
      }
    });
  }, []);

  return (
    <div className="w-full min-h-screen bg-transparent">
      {/* conținutul paginii */}
    </div>
  );
}
