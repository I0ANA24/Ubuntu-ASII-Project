"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import SettingsPage from "@/components/pages/SettingsPage";
import NotepadPage from "@/components/pages/NotepadPage";
import FileExplorerPage from "@/components/pages/FileExplorerPage";
import CalculatorPage from "@/components/pages/CalculatorPage";
// import Etch-a-Sketch page
import EtchASketchPage from "@/components/pages/EtchASketchPage";

const AppManagerContext = createContext(null);

export const useAppManager = () => {
  const context = useContext(AppManagerContext);
  if (!context) {
    throw new Error("useAppManager must be used within an AppManagerProvider");
  }
  return context;
};

const AppManagerProvider = ({ children }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showNotepad, setShowNotepad] = useState(false);
  const [showFileExplorer, setShowFileExplorer] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showEtch, setShowEtch] = useState(false);
  const [notepadRequest, setNotepadRequest] = useState(null);

  const openSettings = () => setShowSettings(true);
  const toggleSettings = () => setShowSettings((prev) => !prev);
  const closeSettings = () => setShowSettings(false);

  const openNotepad = () => setShowNotepad(true);
  const toggleNotepad = () => setShowNotepad((prev) => !prev);
  const closeNotepad = () => {
    setShowNotepad(false);
    setNotepadRequest(null);
  };

  const openFileExplorer = () => setShowFileExplorer(true);
  const toggleFileExplorer = () => setShowFileExplorer((prev) => !prev);
  const closeFileExplorer = () => setShowFileExplorer(false);

  const openCalculator = () => setShowCalculator(true);
  const toggleCalculator = () => setShowCalculator((prev) => !prev);
  const closeCalculator = () => setShowCalculator(false);

  // Etch-a-Sketch controls
  const openEtch = () => setShowEtch(true);
  const toggleEtch = () => setShowEtch((prev) => !prev);
  const closeEtch = () => setShowEtch(false);

  const requestNotepad = (request) => {
    setNotepadRequest(request || null);
    setShowNotepad(true);
  };

  const resetNotepadRequest = () => setNotepadRequest(null);

  const apps = useMemo(
    () => ({
      notepad: {
        id: "notepad",
        title: "Notepad",
        icon: "/icons/notepad.png",
        isOpen: showNotepad,
        open: openNotepad,
        toggle: toggleNotepad,
        request: requestNotepad,
      },
      fileExplorer: {
        id: "fileExplorer",
        title: "File Explorer",
        icon: "/icons/files.png",
        isOpen: showFileExplorer,
        open: openFileExplorer,
        toggle: toggleFileExplorer,
      },
      settings: {
        id: "settings",
        title: "Settings",
        icon: "/icons/settings.png",
        isOpen: showSettings,
        open: openSettings,
        toggle: toggleSettings,
      },
      calculator: {
        id: "calculator",
        title: "Calculator",
        icon: "/icons/calculator.png",
        isOpen: showCalculator,
        open: openCalculator,
        toggle: toggleCalculator,
      },
      etch: {
        id: "etch",
        title: "Etch-a-Sketch",
        icon: "/icons/etch-a-sketch.png",
        isOpen: showEtch,
        open: openEtch,
        toggle: toggleEtch,
      },
    }),
    [showNotepad, showFileExplorer, showSettings, showCalculator, showEtch],
  );

  const openAppById = (appId) => {
    const app = apps[appId];
    if (!app) return;
    if (appId === "notepad") {
      requestNotepad(null);
    } else {
      app.open?.();
    }
  };

  const value = {
    showSettings,
    showNotepad,
    showFileExplorer,
    showCalculator,
    showEtch,
    apps,
    openSettings,
    toggleSettings,
    closeSettings,
    openNotepad,
    toggleNotepad,
    closeNotepad,
    openFileExplorer,
    toggleFileExplorer,
    closeFileExplorer,
    openCalculator,
    toggleCalculator,
    closeCalculator,
    openEtch,
    toggleEtch,
    closeEtch,
    requestNotepad,
    openAppById,
  };

  return (
    <AppManagerContext.Provider value={value}>
      {children}

      {showFileExplorer && (
        <FileExplorerPage
          onClose={closeFileExplorer}
          onOpenFile={(fileId) => {
            closeFileExplorer();
            requestNotepad({ type: "open", fileId });
          }}
          onCreateNew={() => {
            closeFileExplorer();
            requestNotepad({ type: "new" });
          }}
        />
      )}

      {showNotepad && (
        <NotepadPage
          onClose={closeNotepad}
          externalRequest={notepadRequest}
          onRequestHandled={resetNotepadRequest}
        />
      )}

      {showSettings && <SettingsPage onClose={closeSettings} />}

      {showCalculator && <CalculatorPage onClose={closeCalculator} />}
      {showEtch && <EtchASketchPage onClose={closeEtch} />}
    </AppManagerContext.Provider>
  );
};

export default AppManagerProvider;
