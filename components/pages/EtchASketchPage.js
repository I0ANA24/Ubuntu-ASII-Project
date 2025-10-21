'use client';

import React, { useState, useRef, useEffect } from 'react';
import useDraggableWindow from '@/hooks/useDraggableWindow';
import styles from './EtchASketch.module.css';

const EtchASketchPage = ({ onClose }) => {
  const { windowRef, style, handlePointerDown } = useDraggableWindow();
  const [size, setSize] = useState(16);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('black'); // 'black'|'rainbow'|'grayscale'|'color'|'eraser'
  const [color, setColor] = useState('#ff0000');
  const [showGridBorders, setShowGridBorders] = useState(true);
  const [cells, setCells] = useState([]);
  const containerRef = useRef();

  useEffect(() => {
    // initialize cells
    const total = size * size;
    setCells(new Array(total).fill({ bg: '#ffffff', opacity: 1 }));
  }, [size]);

  const applyPaint = (index) => {
    setCells(prev => {
      const copy = prev.slice();
      const cell = { ...copy[index] };

      if (tool === 'black') {
        cell.bg = '#000000';
        cell.opacity = 1;
      } else if (tool === 'eraser') {
        cell.bg = '#ffffff';
        cell.opacity = 1;
      } else if (tool === 'color') {
        cell.bg = color;
        cell.opacity = 1;
      } else if (tool === 'rainbow') {
        const R = Math.floor(Math.random()*256);
        const G = Math.floor(Math.random()*256);
        const B = Math.floor(Math.random()*256);
        cell.bg = `rgb(${R}, ${G}, ${B})`;
        cell.opacity = 1;
      } else if (tool === 'grayscale') {
        cell.bg = '#000000';
        // increment opacity up to 1 in steps
        const current = parseFloat(cell.opacity || 0);
        cell.opacity = Math.min(1, current + 0.1);
      }

      copy[index] = cell;
      return copy;
    });
  };

  const handlePointerDownCell = (e, idx) => {
    e.preventDefault();
    setIsDrawing(true);
    applyPaint(idx);
  };
  const handlePointerEnterCell = (e, idx) => {
    if (!isDrawing) return;
    applyPaint(idx);
  };
  useEffect(() => {
    const stop = () => setIsDrawing(false);
    window.addEventListener('mouseup', stop);
    window.addEventListener('pointerup', stop);
    return () => {
      window.removeEventListener('mouseup', stop);
      window.removeEventListener('pointerup', stop);
    };
  }, []);

  const clearGrid = () => {
    setCells(new Array(size * size).fill({ bg: '#ffffff', opacity: 1 }));
  };

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center pointer-events-none">
      <div
        ref={windowRef}
        style={style}
        className="bg-[#232323] rounded-xl shadow-xl pointer-events-auto mt-24 mx-4"
      >
        <div
          className="flex items-center justify-between px-3 py-1.5 bg-[#303030] rounded-t-xl cursor-move border-b border-[#3c3c3c]"
          onPointerDown={handlePointerDown}
        >
          <div className="text-white text-sm">Etch-a-Sketch</div>
          <button
            onClick={onClose}
            className="text-white hover:bg-[#c13535] rounded p-0.5 w-6 h-6 flex items-center justify-center text-xs"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-4">
          <div className={styles.wrapper}>
            <div className={styles.tools}>
              <div className={styles.buttonsRow}>
                <button 
                  className={`${styles.etchButton} ${tool === 'black' ? styles.activeBtn : ''}`} 
                  onClick={() => setTool('black')}
                >
                  Black
                </button>
                <button 
                  className={`${styles.etchButton} ${tool === 'rainbow' ? styles.activeBtn : ''}`}
                  onClick={() => setTool('rainbow')}
                >
                  Rainbow
                </button>
                <button 
                  className={`${styles.etchButton} ${tool === 'grayscale' ? styles.activeBtn : ''}`}
                  onClick={() => setTool('grayscale')}
                >
                  Gray Scale
                </button>
                <label className={`${styles.etchButton} ${tool === 'color' ? styles.activeBtn : ''}`}>
                  Color: <input className={styles.colorInput} type="color" value={color} onChange={(e)=>{ setColor(e.target.value); setTool('color'); }} />
                </label>
                <button 
                  className={`${styles.etchButton} ${tool === 'eraser' ? styles.activeBtn : ''}`}
                  onClick={() => setTool('eraser')}
                >
                  Eraser
                </button>
                <button 
                  className={`${styles.etchButton} ${showGridBorders ? styles.activeBtn : ''}`}
                  onClick={() => setShowGridBorders(prev => !prev)}
                >
                  Grid
                </button>
                <button 
                  className={styles.etchButton}
                  onClick={clearGrid}
                >
                  Clear
                </button>
              </div>

              <div className={styles.buttonsRow}>
                <div className={styles.sliderContainer}>
                  <input className={styles.slider} type="range" min="2" max="100" value={size} onChange={(e)=>setSize(Number(e.target.value))} />
                  <div className={styles.value}>Size: {size} x {size}</div>
                </div>
              </div>
            </div>

            <div ref={containerRef} className={styles.boardWrapper}>
              <div
                className={styles.grid}
                style={{
                  gridTemplateColumns: `repeat(${size}, 1fr)`,
                  // removed fixed width/height to make grid responsive
                }}
              >
                {cells.map((cell, idx) => (
                  <div
                    key={idx}
                    className={styles.square}
                    onMouseDown={(e)=>handlePointerDownCell(e, idx)}
                    onMouseEnter={(e)=>handlePointerEnterCell(e, idx)}
                    style={{
                      backgroundColor: cell.bg,
                      opacity: cell.opacity,
                      border: showGridBorders ? '0.5px solid rgba(0,0,0,0.2)' : 'none',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EtchASketchPage;