"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVE_SELECTOR = "button, a, input, textarea, select, [data-prevent-drag]";

const useDraggableWindow = () => {
  const windowRef = useRef(null);
  const dragState = useRef({
    active: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    captureTarget: null,
  });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (event) => {
      if (
        !dragState.current.active ||
        (dragState.current.pointerId !== null &&
          event.pointerId !== dragState.current.pointerId)
      ) {
        return;
      }

      const deltaX = event.clientX - dragState.current.startX;
      const deltaY = event.clientY - dragState.current.startY;

      setPosition({
        x: dragState.current.originX + deltaX,
        y: dragState.current.originY + deltaY,
      });
    };

    const stopDragging = (event) => {
      if (
        !dragState.current.active ||
        (event?.pointerId !== undefined &&
          dragState.current.pointerId !== null &&
          event.pointerId !== dragState.current.pointerId)
      ) {
        return;
      }

      const { pointerId, captureTarget } = dragState.current;
      if (pointerId !== null && captureTarget) {
        captureTarget.releasePointerCapture?.(pointerId);
      }

      dragState.current.active = false;
      dragState.current.pointerId = null;
      dragState.current.captureTarget = null;
      document.body.style.userSelect = "";
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopDragging);
    window.addEventListener("pointercancel", stopDragging);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopDragging);
      window.removeEventListener("pointercancel", stopDragging);

      // eslint-disable-next-line react-hooks/exhaustive-deps -- read latest drag state when unmounting.
      const { pointerId, captureTarget } = dragState.current;
      if (pointerId !== null && captureTarget) {
        captureTarget.releasePointerCapture?.(pointerId);
      }

      document.body.style.userSelect = "";
    };
  }, []);

  const handlePointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    if (
      event.target instanceof Element &&
      event.target.closest(INTERACTIVE_SELECTOR)
    ) {
      return;
    }

    dragState.current.active = true;
    dragState.current.pointerId = event.pointerId;
    dragState.current.startX = event.clientX;
    dragState.current.startY = event.clientY;
    dragState.current.originX = position.x;
    dragState.current.originY = position.y;
    dragState.current.captureTarget = windowRef.current;

    windowRef.current?.setPointerCapture?.(event.pointerId);
    document.body.style.userSelect = "none";
    event.preventDefault();
  };

  const resetPosition = () => setPosition({ x: 0, y: 0 });

  return {
    windowRef,
    style: {
      transform: `translate(${position.x}px, ${position.y}px)`,
    },
    handlePointerDown,
    resetPosition,
  };
};

export default useDraggableWindow;
