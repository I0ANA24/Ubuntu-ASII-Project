"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

const Icon = ({ src, onClick, alt = "App_Icon", isActive = false, draggableData }) => {
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

  const handleKeyDown = (event) => {
    if (!onClick) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  const handleDragStart = (event) => {
    if (!draggableData) return;
    try {
      event.dataTransfer.effectAllowed = "copy";
      event.dataTransfer.setData(
        "application/x-asa-app",
        JSON.stringify({ appId: draggableData.appId })
      );
      event.dataTransfer.setData("text/plain", draggableData.appId);
    } catch {
      // ignore if drag data cannot be set
    }
  };

  return (
    <div
      className={`h-full aspect-square relative text-white rounded-sm ${
        onClick ? "hover:cursor-pointer hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70" : ""
      } ${isActive ? "bg-white/25" : ""}`}
      role={onClick ? "button" : undefined}
      aria-pressed={onClick ? isActive : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      draggable={Boolean(draggableData)}
      onDragStart={handleDragStart}
    >
      <Image src={finalSrc} fill alt={alt} className="p-1 object-cover" />
      {isActive && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-0.5 rounded-full bg-white shadow-[0_0_4px_rgba(255,255,255,0.7)]" />
      )}
    </div>
  );
};

export default Icon;
