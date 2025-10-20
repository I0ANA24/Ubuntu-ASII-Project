"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

const Icon = ({ src }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    try {
      const v = localStorage.getItem("isDarkMode");
      setIsDarkMode(v === null ? true : v === "true");
    } catch {
      setIsDarkMode(true);
    }

    const onStorage = (e) => {
      if (e.key === "isDarkMode") {
        setIsDarkMode(e.newValue === "true");
      }
    };

    const onThemeEvent = (e) => {
      if (typeof e.detail !== "undefined") {
        setIsDarkMode(Boolean(e.detail));
      }
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("asa:theme-changed", onThemeEvent);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("asa:theme-changed", onThemeEvent);
    };
  }, []);

  const srcStr = typeof src === "string" ? src : src?.src || "";
  const finalSrc =
    srcStr.includes("show-apps")
      ? isDarkMode
        ? "/icons/show-apps-darkmode.png"
        : "/icons/show-apps-whitemode.png"
      : src;

  return (
    <div className="h-full aspect-square relative text-white hover:bg-white/20 rounded-sm hover:cursor-pointer">
      <Image src={finalSrc} fill alt="App_Icon" className="p-1 object-cover" />
    </div>
  );
};

export default Icon;
