"use client";

import React, { useEffect, useMemo, useState } from "react";
import useDraggableWindow from "@/hooks/useDraggableWindow";
import { deleteFile, loadFiles } from "@/utils/fileManager";
import { readThemePreference, subscribeToThemePreference } from "@/utils/theme";

const formatTimestamp = (value) => {
  if (!value) return "Unknown";
  try {
    return new Date(value).toLocaleString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Unknown";
  }
};

const FileExplorerPage = ({ onClose, onOpenFile, onCreateNew }) => {
  const { windowRef, style, handlePointerDown } = useDraggableWindow();
  const [isDarkMode, setIsDarkMode] = useState(readThemePreference);
  const [files, setFiles] = useState(() => loadFiles());

  useEffect(() => {
    setIsDarkMode(readThemePreference());
    const unsubscribe = subscribeToThemePreference(setIsDarkMode);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setFiles(loadFiles());
    const onFilesUpdated = (event) => {
      if (Array.isArray(event.detail)) {
        setFiles(event.detail);
      } else {
        setFiles(loadFiles());
      }
    };

    window.addEventListener("asa:files-updated", onFilesUpdated);
    return () => window.removeEventListener("asa:files-updated", onFilesUpdated);
  }, []);

  const sortedFiles = useMemo(
    () =>
      [...files].sort((a, b) => {
        const aTime = a.updatedAt || a.createdAt || 0;
        const bTime = b.updatedAt || b.createdAt || 0;
        return bTime - aTime;
      }),
    [files],
  );

  const handleDelete = (fileId) => {
    const remaining = deleteFile(fileId);
    setFiles(remaining);
  };

  const containerTheme = isDarkMode
    ? "bg-gray-900 border-gray-700 text-gray-100 shadow-gray-900/40"
    : "bg-white border-gray-200 text-gray-900 shadow-gray-500/30";

  const headerTheme = isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200";
  const bodyTheme = isDarkMode ? "divide-gray-800" : "divide-gray-200";
  const actionPrimary = isDarkMode
    ? "bg-indigo-500 hover:bg-indigo-400 text-white"
    : "bg-indigo-600 hover:bg-indigo-500 text-white";
  const actionSecondary = isDarkMode
    ? "bg-gray-800 hover:bg-gray-700 text-gray-100"
    : "bg-gray-200 hover:bg-gray-300 text-gray-900";

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center pointer-events-none">
      <div
        ref={windowRef}
        style={style}
        className={`pointer-events-auto mt-24 w-[520px] rounded-2xl border shadow-2xl ${containerTheme}`}
      >
        <header
          className={`flex items-center justify-between px-4 py-2 border-b cursor-move select-none ${headerTheme}`}
          onPointerDown={handlePointerDown}
        >
          <h2 className="text-sm font-medium">File Explorer</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCreateNew}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${actionSecondary}`}
            >
              New Note
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close file explorer"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/90 text-white hover:bg-red-500 transition"
            >
              &times;
            </button>
          </div>
        </header>

        <div className={`max-h-[70vh] overflow-y-auto divide-y ${bodyTheme}`}>
          {sortedFiles.length === 0 ? (
            <div className="px-6 py-8 text-sm text-center opacity-70">
              No files saved yet. Create a note in Notepad and press Save to see it here.
            </div>
          ) : (
            sortedFiles.map((file) => {
              const preview = file.content ? file.content.slice(0, 80) : "Empty file";
              return (
                <div
                  key={file.id}
                  className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-indigo-500/10"
                >
                  <div className="flex-1">
                    <button
                      type="button"
                      onClick={() => onOpenFile?.(file.id)}
                      className="text-left"
                    >
                      <h3 className="text-sm font-semibold">{file.title || "Untitled note"}</h3>
                      <p className="mt-1 text-xs opacity-70">{preview}</p>
                    </button>
                    <p className="mt-2 text-[11px] uppercase tracking-wide opacity-60">
                      Last edit: {formatTimestamp(file.updatedAt || file.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenFile?.(file.id)}
                      className={`rounded-md px-3 py-1 text-xs font-medium transition ${actionPrimary}`}
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(file.id)}
                      className="rounded-md px-3 py-1 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default FileExplorerPage;
