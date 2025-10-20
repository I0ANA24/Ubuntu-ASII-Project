"use client";

const STORAGE_KEY = "asa-files";

const safeParse = (value) => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const loadFiles = () => {
  if (typeof window === "undefined") return [];
  try {
    return safeParse(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
};

export const persistFiles = (files) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
    window.dispatchEvent(new CustomEvent("asa:files-updated", { detail: files }));
  } catch {
    // ignore persistence failures (storage disabled, quota, etc.)
  }
};

export const upsertFile = ({ id, title, content }) => {
  const files = loadFiles();
  const timestamp = Date.now();
  let nextFiles;
  let targetFile;

  if (id) {
    nextFiles = files.map((file) => {
      if (file.id === id) {
        targetFile = {
          ...file,
          title,
          content,
          updatedAt: timestamp,
        };
        return targetFile;
      }
      return file;
    });

    if (!targetFile) {
      targetFile = {
        id,
        title,
        content,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      nextFiles = [...files, targetFile];
    }
  } else {
    targetFile = {
      id: `file-${timestamp}`,
      title,
      content,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    nextFiles = [...files, targetFile];
  }

  persistFiles(nextFiles);
  return targetFile;
};

export const deleteFile = (id) => {
  const files = loadFiles();
  const nextFiles = files.filter((file) => file.id !== id);
  persistFiles(nextFiles);
  return nextFiles;
};

export const findFile = (id) => {
  const files = loadFiles();
  return files.find((file) => file.id === id) || null;
};
