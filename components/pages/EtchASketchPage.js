"use client";

import React, { useState, useRef } from 'react';
import useDraggableWindow from '@/hooks/useDraggableWindow';
import styles from './EtchASketch.module.css';

const EtchASketchPage = ({ onClose }) => {
  const { windowRef, style, handlePointerDown } = useDraggableWindow();
  const [boardSize, setBoardSize] = useState(16);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState('black');
  const [showGrid, setShowGrid] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#FF0000');
  const gridRef = useRef(null);

  const createGrid = () => {
    const squares = [];
    const squareLength = 100 / boardSize;
    
    for (let i = 0; i < boardSize * boardSize; i++) {
      squares.push(
        <div
          key={i}
          className={styles.square}
          style={{
            width: `${squareLength}%`,
            height: `${squareLength}%`,
            border: showGrid ? '0.1px solid gray' : 'none'
          }}
        />
      );
    }
    return squares;
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    handleDraw(e);
  };

  const handleDraw = (e) => {
    if (!isDrawing || !e.target.classList.contains(styles.square)) return;

    switch (currentTool) {
      case 'black':
        e.target.style.backgroundColor = 'black';
        e.target.style.opacity = '1';
        break;
      case 'rainbow':
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        e.target.style.backgroundColor = `rgb(${r},${g},${b})`;
        e.target.style.opacity = '1';
        break;
      case 'grayScale':
        e.target.style.backgroundColor = 'black';
        const currentOpacity = parseFloat(e.target.style.opacity) || 0;
        e.target.style.opacity = Math.min(currentOpacity + 0.1, 1);
        break;
      case 'color':
        e.target.style.backgroundColor = selectedColor;
        e.target.style.opacity = '1';
        break;
      case 'eraser':
        e.target.style.backgroundColor = 'white';
        e.target.style.opacity = '1';
        break;
    }
  };

  const clearGrid = () => {
    const squares = gridRef.current.children;
    Array.from(squares).forEach(square => {
      square.style.backgroundColor = 'white';
      square.style.opacity = '1';
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center pointer-events-none">
      <div
        ref={windowRef}
        style={style}
        className="bg-[#232323] rounded-xl shadow-xl pointer-events-auto mt-12 mx-4 max-w-[600px] w-full"
      >
        {/* Window Header */}
        <div 
          className="flex items-center justify-between px-3 py-1.5 bg-[#303030] rounded-t-xl cursor-move border-b border-[#3c3c3c]"
          onPointerDown={handlePointerDown}
        >
          <div className="text-white text-sm">Etch-a-Sketch</div>
          <button
            onClick={onClose}
            className="text-white hover:bg-[#c13535] rounded p-0.5 w-5 h-5 flex items-center justify-center text-xs"
          >
            ✕
          </button>
        </div>

        {/* Game Content */}
        <div className={styles.content}>
          <div className={styles.tools}>
            <button 
              className={`${styles.button} ${currentTool === 'black' ? styles.active : ''}`}
              onClick={() => setCurrentTool('black')}
            >
              Black
            </button>
            <button 
              className={`${styles.button} ${currentTool === 'rainbow' ? styles.active : ''}`}
              onClick={() => setCurrentTool('rainbow')}
            >
              Rainbow
            </button>
            <button 
              className={`${styles.button} ${currentTool === 'grayScale' ? styles.active : ''}`}
              onClick={() => setCurrentTool('grayScale')}
            >
              Gray Scale
            </button>
            <div className={styles.colorPickerContainer}>
              <button 
                className={`${styles.button} ${currentTool === 'color' ? styles.active : ''}`}
                onClick={() => setCurrentTool('color')}
              >
                Color: 
                <input 
                  type="color" 
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className={styles.colorPicker}
                />
              </button>
            </div>
            <button 
              className={`${styles.button} ${currentTool === 'eraser' ? styles.active : ''}`}
              onClick={() => setCurrentTool('eraser')}
            >
              Eraser
            </button>
            <button 
              className={`${styles.button} ${showGrid ? styles.active : ''}`}
              onClick={() => setShowGrid(!showGrid)}
            >
              Grid
            </button>
            <button 
              className={styles.button}
              onClick={clearGrid}
            >
              Clear
            </button>
            <div className={styles.sliderContainer}>
              <input
                type="range"
                min="2"
                max="100"
                value={boardSize}
                onChange={(e) => setBoardSize(Number(e.target.value))}
                className={styles.slider}
              />
              <div className={styles.value}>
                Size: {boardSize} x {boardSize}
              </div>
            </div>
          </div>
          <div 
            className={styles.grid}
            ref={gridRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleDraw}
            onMouseUp={() => setIsDrawing(false)}
            onMouseLeave={() => setIsDrawing(false)}
          >
            {createGrid()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EtchASketchPage;