"use client";
import React, { useState, useEffect } from "react";
import useDraggableWindow from "@/hooks/useDraggableWindow";
import styles from "./TicTacToe.module.css";

const TicTacToePage = ({ onClose }) => {
  const { windowRef, style, handlePointerDown } = useDraggableWindow();
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index) => {
    const squares = board.slice();
    if (winner || squares[index]) return;
    squares[index] = xIsNext ? "X" : "O";
    setBoard(squares);
    setXIsNext(!xIsNext);
    setWinner(calculateWinner(squares));
  };

  const renderSquare = (index) => (
    <button
      key={index}
      className={styles.square}
      onClick={() => handleClick(index)}
    >
      {board[index]}
    </button>
  );

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setXIsNext(true);
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
        <div className={styles.container}>
          <h1 className="text-white pb-4">Tic Tac Toe</h1>
          <div className={styles.board}>
            {Array(9)
              .fill(null)
              .map((_, index) => renderSquare(index))}
          </div>
          {winner && <div className={styles.winner}>Winner: {winner}</div>}
          <button className={styles.resetButton} onClick={resetGame}>
            Reset Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicTacToePage;
