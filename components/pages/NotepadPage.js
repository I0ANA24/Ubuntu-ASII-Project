"use client";

import React, { useEffect, useRef, useState } from "react";
import useDraggableWindow from "@/hooks/useDraggableWindow";
import { readThemePreference, subscribeToThemePreference } from "@/utils/theme";
import { findFile, upsertFile } from "@/utils/fileManager";

const DEFAULT_TITLE = "Untitled note";

const NotepadPage = ({ onClose, externalRequest, onRequestHandled }) => {
  const [isDarkMode, setIsDarkMode] = useState(readThemePreference);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [fileId, setFileId] = useState(null);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const textareaRef = useRef(null);
  const { windowRef: panelRef, style: panelStyle, handlePointerDown } = useDraggableWindow();

  useEffect(() => {
    setIsDarkMode(readThemePreference());
    const unsubscribe = subscribeToThemePreference(setIsDarkMode);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let storedContent = "";
    let storedTitle = DEFAULT_TITLE;
    let storedFileId = null;
    let storedLastSaved = null;

    try {
      storedContent = window.localStorage.getItem("notepadContent") || "";
      storedTitle = window.localStorage.getItem("notepadTitle") || DEFAULT_TITLE;
      storedFileId = window.localStorage.getItem("notepadFileId");
      const savedTimestamp = window.localStorage.getItem("notepadLastSaved");
      storedLastSaved = savedTimestamp ? Number(savedTimestamp) : null;
    } catch {
      // ignore
    }

    if (storedFileId) {
      const savedFile = findFile(storedFileId);
      if (savedFile) {
        setFileId(savedFile.id);
        setTitle(savedFile.title || DEFAULT_TITLE);
        setContent(savedFile.content || "");
         setLastSavedAt(savedFile.updatedAt || savedFile.createdAt || null);
        return;
      }
    }

    setFileId(storedFileId || null);
    setTitle(storedTitle);
    setContent(storedContent);
    setLastSavedAt(storedLastSaved);
  }, []);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("notepadContent", content);
      window.localStorage.setItem("notepadTitle", title);
      if (fileId) {
        window.localStorage.setItem("notepadFileId", fileId);
      } else {
        window.localStorage.removeItem("notepadFileId");
      }

      if (lastSavedAt) {
        window.localStorage.setItem("notepadLastSaved", String(lastSavedAt));
      } else {
        window.localStorage.removeItem("notepadLastSaved");
      }
    } catch {
      // ignore persistence failures (private mode, etc.)
    }
  }, [content, title, fileId, lastSavedAt]);

  useEffect(() => {
    if (!externalRequest) return;

    if (externalRequest.type === "open" && externalRequest.fileId) {
      const file = findFile(externalRequest.fileId);
      if (file) {
        setFileId(file.id);
        setTitle(file.title || DEFAULT_TITLE);
        setContent(file.content || "");
        setLastSavedAt(file.updatedAt || file.createdAt || null);
      }
    } else if (externalRequest.type === "new") {
      setFileId(null);
      setTitle(DEFAULT_TITLE);
      setContent("");
      setLastSavedAt(null);
    }

    onRequestHandled?.();
  }, [externalRequest, onRequestHandled]);

  const containerTheme = isDarkMode
    ? "bg-gray-900 border-gray-700 text-gray-100 shadow-gray-900/40"
    : "bg-white border-gray-200 text-gray-900 shadow-gray-500/30";

  const headerTheme = isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200";
  const textareaTheme = isDarkMode
    ? "bg-gray-900 text-gray-100 placeholder-gray-400"
    : "bg-white text-gray-900 placeholder-gray-500";

  const handleNewNote = () => {
    setFileId(null);
    setTitle(DEFAULT_TITLE);
    setContent("");
    setLastSavedAt(null);
  };

  const handleClear = () => {
    setContent("");
  };

  const handleSave = () => {
    const sanitizedTitle = title.trim() || DEFAULT_TITLE;
    const savedFile = upsertFile({
      id: fileId,
      title: sanitizedTitle,
      content,
    });

    setFileId(savedFile.id);
    setTitle(savedFile.title || DEFAULT_TITLE);
    setLastSavedAt(savedFile.updatedAt || savedFile.createdAt || Date.now());
  };

  const formattedLastSaved = lastSavedAt
    ? new Date(lastSavedAt).toLocaleString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  const inputTheme = isDarkMode
    ? "bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500"
    : "bg-white border-gray-200 text-gray-900 placeholder-gray-400";

  const buttonPrimaryTheme = isDarkMode
    ? "bg-indigo-500 hover:bg-indigo-400 text-white"
    : "bg-indigo-600 hover:bg-indigo-500 text-white";

  const buttonSecondaryTheme = isDarkMode
    ? "bg-gray-800 hover:bg-gray-700 text-gray-100"
    : "bg-gray-200 hover:bg-gray-300 text-gray-900";

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center pointer-events-none">
      <div
        ref={panelRef}
        style={panelStyle}
        className={`pointer-events-auto mt-24 w-[420px] rounded-2xl border shadow-2xl ${containerTheme}`}
      >
        <header
          className={`flex items-center justify-between px-4 py-2 border-b cursor-move select-none ${headerTheme}`}
          onPointerDown={handlePointerDown}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Notepad</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close notepad"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/90 text-white hover:bg-red-500 transition"
          >
            &times;
          </button>
        </header>

        <div className="px-4 py-3 space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Note title"
              className={`w-full rounded-lg border px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 ${inputTheme}`}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSave}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${buttonPrimaryTheme}`}
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleNewNote}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${buttonSecondaryTheme}`}
              >
                New
              </button>
            </div>
          </div>

          <textarea
            ref={textareaRef}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write your notes here..."
            className={`w-full resize-none rounded-xl border px-4 py-3 text-base leading-relaxed outline-none transition focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 ${textareaTheme} ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
            rows={12}
          />

          <div
            className={`mt-3 flex items-center justify-between text-xs ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span>{content.length} characters</span>
              {formattedLastSaved && (
                <span className="sm:border-l sm:pl-2 sm:border-gray-500/40">
                  Saved {formattedLastSaved}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="rounded-md px-2 py-1 text-xs font-medium text-indigo-500 hover:bg-indigo-500/10"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotepadPage;
