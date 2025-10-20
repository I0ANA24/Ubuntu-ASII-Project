"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAppManager } from "@/contexts/AppManagerContext";

const STORAGE_KEY = "asa-desktop-icons";
const ICON_SIZE = 70;

const readDesktopItems = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeDesktopItems = (items) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore storage failures
  }
};

const clampPosition = (x, y, rect) => {
  if (!rect) return { x: 0, y: 0 };
  const maxX = Math.max(0, rect.width - ICON_SIZE);
  const maxY = Math.max(0, rect.height - ICON_SIZE);
  return {
    x: Math.min(Math.max(0, x), maxX),
    y: Math.min(Math.max(0, y), maxY),
  };
};

const DesktopArea = () => {
  const { apps, openAppById } = useAppManager();
  const [items, setItems] = useState(() => readDesktopItems());
  const itemsRef = useRef(items);
  const containerRef = useRef(null);
  const dragState = useRef({
    active: false,
    itemId: null,
    pointerId: null,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    moved: false,
    captureTarget: null,
  });
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    itemId: null,
  });
  const menuRef = useRef(null);

  useEffect(() => {
    itemsRef.current = items;
    writeDesktopItems(items);
  }, [items]);

  useEffect(() => {
    if (!contextMenu.visible) return undefined;

    const handlePointerDown = (event) => {
      if (menuRef.current && menuRef.current.contains(event.target)) {
        return;
      }
      setContextMenu({
        visible: false,
        x: 0,
        y: 0,
        itemId: null,
      });
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setContextMenu({
          visible: false,
          x: 0,
          y: 0,
          itemId: null,
        });
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [contextMenu.visible]);

  const updateItemPosition = useCallback((itemId, x, y) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, x, y } : item)),
    );
  }, []);

  useEffect(() => {
    const handlePointerMove = (event) => {
      const state = dragState.current;
      if (!state.active || state.pointerId !== event.pointerId) {
        return;
      }

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const deltaX = event.clientX - state.startX;
      const deltaY = event.clientY - state.startY;

      const rawX = state.originX + deltaX;
      const rawY = state.originY + deltaY;
      const { x, y } = clampPosition(rawX, rawY, rect);

      if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
        state.moved = true;
      }

      updateItemPosition(state.itemId, x, y);
    };

    const handlePointerEnd = (event) => {
      const state = dragState.current;
      if (!state.active || (state.pointerId !== null && state.pointerId !== event.pointerId)) {
        return;
      }

      state.captureTarget?.releasePointerCapture?.(state.pointerId);

      const moved = state.moved;
      const itemId = state.itemId;
      dragState.current = {
        active: false,
        itemId: null,
        pointerId: null,
        startX: 0,
        startY: 0,
        originX: 0,
        originY: 0,
        moved: false,
        captureTarget: null,
      };
      document.body.style.userSelect = "";

      if (!moved && event.button === 0 && itemId) {
        const item = itemsRef.current.find((entry) => entry.id === itemId);
        if (item) {
          openAppById(item.appId);
        }
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerEnd);
    window.addEventListener("pointercancel", handlePointerEnd);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerEnd);
      window.removeEventListener("pointercancel", handlePointerEnd);
    };
  }, [openAppById, updateItemPosition]);

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (event) => {
    event.preventDefault();

    let payload;
    const jsonPayload = event.dataTransfer.getData("application/x-asa-app");
    if (jsonPayload) {
      try {
        payload = JSON.parse(jsonPayload);
      } catch {
        payload = null;
      }
    }

    let appId = payload?.appId;
    if (!appId) {
      const textPayload = event.dataTransfer.getData("text/plain");
      appId = textPayload || null;
    }

    if (!appId || !apps[appId]) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const rawX = event.clientX - rect.left - ICON_SIZE / 2;
    const rawY = event.clientY - rect.top - ICON_SIZE / 2;
    const { x, y } = clampPosition(rawX, rawY, rect);

    setItems((prev) => [
      ...prev,
      {
        id: `desktop-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        appId,
        x,
        y,
      },
    ]);
  };

  const startDrag = (event, itemId) => {
    if (event.button !== 0) return;

    const item = itemsRef.current.find((entry) => entry.id === itemId);
    if (!item) return;

    event.preventDefault();

    dragState.current = {
      active: true,
      itemId,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: item.x,
      originY: item.y,
      moved: false,
      captureTarget: event.currentTarget,
    };

    event.currentTarget.setPointerCapture?.(event.pointerId);
    document.body.style.userSelect = "none";
  };

  const handleContextMenu = (event, itemId) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      itemId,
    });
  };

  const handleDelete = () => {
    if (!contextMenu.itemId) return;
    setItems((prev) => prev.filter((item) => item.id !== contextMenu.itemId));
    setContextMenu({
      visible: false,
      x: 0,
      y: 0,
      itemId: null,
    });
  };

  const handleKeyDown = (event, appId) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openAppById(appId);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen pt-12 pb-20 pl-6 pr-6"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {items.map((item) => {
        const app = apps[item.appId];
        if (!app) {
          return null;
        }
        return (
          <div
            key={item.id}
            className="absolute flex flex-col items-center"
            style={{
              left: `${item.x}px`,
              top: `${item.y}px`,
            }}
          >
            <button
              type="button"
              className="group flex w-24 flex-col items-center gap-2 rounded-md bg-black/10 bg-opacity-0 p-2 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              onPointerDown={(event) => startDrag(event, item.id)}
              onContextMenu={(event) => handleContextMenu(event, item.id)}
              onKeyDown={(event) => handleKeyDown(event, app.id)}
            >
              <span className="relative h-14 w-14 drop-shadow-lg">
                <Image src={app.icon} alt={app.title} fill draggable={false} />
              </span>
              <span className="text-center text-xs font-medium leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {app.title}
              </span>
            </button>
          </div>
        );
      })}

      {contextMenu.visible && (
        <div
          ref={menuRef}
          className="absolute z-50 min-w-[160px] rounded-md border border-gray-600 bg-black/80 text-white text-sm shadow-xl"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            type="button"
            onClick={handleDelete}
            className="w-full px-4 py-2 text-left hover:bg-red-500/70"
          >
            Delete from Desktop
          </button>
        </div>
      )}
    </div>
  );
};

export default DesktopArea;
