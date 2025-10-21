"use client";

import React from "react";
import Icon from "./Icon";
import { useAppManager } from "@/contexts/AppManagerContext";

const BottomBar = () => {
  const { apps, toggleNotepad, toggleFileExplorer, toggleSettings, toggleCalculator, toggleEtchASketch } = useAppManager();

  const notepadApp = apps.notepad;
  const fileExplorerApp = apps.fileExplorer;
  const settingsApp = apps.settings;
  const etchASketchApp = apps.etchASketch;

  return (
    <footer className="w-full h-11 absolute bottom-0 left-0 bg-black/70 text-white flex justify-center items-center p-1 space-x-1.5">
      <Icon src="/icons/text.png" />
      <Icon
        src={fileExplorerApp.icon}
        alt={fileExplorerApp.title}
        isActive={fileExplorerApp.isOpen}
        onClick={toggleFileExplorer}
        draggableData={{ appId: fileExplorerApp.id }}
      />
      <Icon
        src={notepadApp.icon}
        alt={notepadApp.title}
        isActive={notepadApp.isOpen}
        onClick={toggleNotepad}
        draggableData={{ appId: notepadApp.id }}
      />
      <Icon
        src={etchASketchApp.icon}
        alt={etchASketchApp.title}
        isActive={etchASketchApp.isOpen}
        onClick={toggleEtchASketch}
        draggableData={{ appId: etchASketchApp.id }}
      />
      <Icon src="/icons/tic-tac-toe.png" />
      <Icon
        src={apps.calculator.icon}
        alt={apps.calculator.title}
        isActive={apps.calculator.isOpen}
        onClick={toggleCalculator}
        draggableData={{ appId: apps.calculator.id }}
      />
      <div className="bg-gray-500 h-6.5 w-[1px]"></div>
      <Icon
        src={settingsApp.icon}
        alt={settingsApp.title}
        isActive={settingsApp.isOpen}
        onClick={toggleSettings}
        draggableData={{ appId: settingsApp.id }}
      />
      <Icon src="/icons/show-apps.png" />
    </footer>
  );
};

export default BottomBar;
