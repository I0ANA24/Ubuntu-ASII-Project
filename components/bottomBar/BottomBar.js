"use client";

import React, { useState } from "react";
import Icon from "./Icon";
import SettingsPage from "../pages/SettingsPage";

const BottomBar = () => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <footer className="w-full h-11 absolute bottom-0 left-0 bg-black/70 flex justify-center items-center p-1 space-x-1.5">
        <Icon src="/icons/text.png" />
        <Icon src="/icons/files.png" />
        <Icon src="/icons/notepad.png" />
        <Icon src="/icons/etch-a-sketch.png" />
        <Icon src="/icons/tic-tac-toe.png" />
        <Icon src="/icons/calculator.png" />
        <div className="bg-gray-500 h-6.5 w-[1px]"></div>
        <button
          aria-label="Settings"
          onClick={() => setShowSettings(true)}
          className="p-1 rounded hover:bg-white/10"
        >
          <img src="/icons/settings.png" alt="settings" className="h-9 w-9 object-contain" />
        </button>
        <Icon src="/icons/show-apps.png" />
      </footer>

      {showSettings && <SettingsPage onClose={() => setShowSettings(false)} />}
    </>
  );
};

export default BottomBar;
