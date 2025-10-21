'use client';

import React, { useState, useEffect } from 'react';
import useDraggableWindow from '@/hooks/useDraggableWindow';
import styles from './Calculator.module.css';

const CalculatorPage = ({ onClose }) => {
  const { windowRef, style, handlePointerDown } = useDraggableWindow();
  const [upperScreen, setUpperScreen] = useState('');
  const [lowerScreen, setLowerScreen] = useState('0');
  const [firstNumber, setFirstNumber] = useState(null);
  const [operation, setOperation] = useState(null);
  const [newNumber, setNewNumber] = useState(true);

  const calculate = (a, b, op) => {
    switch(op) {
      case '+': return a + b;
      case '-': return a - b;
      case 'x': return a * b;
      case '/': return a / b;
      case 'xn': return Math.pow(a, b);
      default: return b;
    }
  };

  const handleNumber = (num) => {
    if (newNumber) {
      setLowerScreen(num);
      setNewNumber(false);
    } else {
      setLowerScreen(lowerScreen === '0' ? num : lowerScreen + num);
    }
  };

  const handleOperator = (op) => {
    const current = parseFloat(lowerScreen);
    
    if (op === '=' && operation) {
      const result = calculate(firstNumber, current, operation);
      setUpperScreen('');
      setLowerScreen(result.toString());
      setFirstNumber(null);
      setOperation(null);
    } else if (op === '+/-') {
      setLowerScreen((parseFloat(lowerScreen) * -1).toString());
    } else {
      setFirstNumber(current);
      setOperation(op);
      setUpperScreen(`${current} ${op}`);
      setNewNumber(true);
    }
  };

  const handlePoint = () => {
    if (!lowerScreen.includes('.')) {
      setLowerScreen(lowerScreen + '.');
    }
  };

  const handleClear = () => {
    setLowerScreen('0');
    setNewNumber(true);
  };

  const handleAllClear = () => {
    setUpperScreen('');
    setLowerScreen('0');
    setFirstNumber(null);
    setOperation(null);
    setNewNumber(true);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center pointer-events-none">
      <div
        ref={windowRef}
        style={style}
        className="bg-[#232323] rounded-xl shadow-xl pointer-events-auto mt-24 mx-4"
      >
        {/* Window Header */}
        <div 
          className="flex items-center justify-between px-3 py-1.5 bg-[#303030] rounded-t-xl cursor-move border-b border-[#3c3c3c]"
          onPointerDown={handlePointerDown}
        >
          <div className="text-white text-sm">Calculator</div>
          <button
            onClick={onClose}
            className="text-white hover:bg-[#c13535] rounded p-0.5 w-5 h-5 flex items-center justify-center text-xs"
          >
            ✕
          </button>
        </div>

        {/* Calculator Content */}
        <div className="p-4">
          <div className={styles.content}>
            <div className={styles.screen}>
              <div className={styles.screenUp}>{upperScreen}</div>
              <div className={styles.screenDown}>{lowerScreen}</div>
            </div>
            <div className={styles.buttons}>
              <div className={`${styles.button} ${styles.allClear}`} onClick={handleAllClear}>AC</div>
              <div className={`${styles.button} ${styles.clear}`} onClick={handleClear}>C</div>
              <div className={`${styles.button} ${styles.operator}`} onClick={() => handleOperator('xn')}>x<sup>n</sup></div>
              <div className={`${styles.button} ${styles.operator}`} onClick={() => handleOperator('+/-')}>+/-</div>
              <div className={`${styles.button} ${styles.digit}`} onClick={() => handleNumber('7')}>7</div>
              <div className={`${styles.button} ${styles.digit}`} onClick={() => handleNumber('8')}>8</div>
              <div className={`${styles.button} ${styles.digit}`} onClick={() => handleNumber('9')}>9</div>
              <div className={`${styles.button} ${styles.operator}`} onClick={() => handleOperator('/')}>÷</div>
              <div className={`${styles.button} ${styles.digit}`} onClick={() => handleNumber('4')}>4</div>
              <div className={`${styles.button} ${styles.digit}`} onClick={() => handleNumber('5')}>5</div>
              <div className={`${styles.button} ${styles.digit}`} onClick={() => handleNumber('6')}>6</div>
              <div className={`${styles.button} ${styles.operator}`} onClick={() => handleOperator('x')}>x</div>
              <div className={`${styles.button} ${styles.digit}`} onClick={() => handleNumber('1')}>1</div>
              <div className={`${styles.button} ${styles.digit}`} onClick={() => handleNumber('2')}>2</div>
              <div className={`${styles.button} ${styles.digit}`} onClick={() => handleNumber('3')}>3</div>
              <div className={`${styles.button} ${styles.operator}`} onClick={() => handleOperator('-')}>-</div>
              <div className={`${styles.button} ${styles.digit}`} onClick={() => handleNumber('0')}>0</div>
              <div className={`${styles.button} ${styles.point}`} onClick={handlePoint}>.</div>
              <div className={`${styles.button} ${styles.operator}`} onClick={() => handleOperator('=')}>=</div>
              <div className={`${styles.button} ${styles.operator}`} onClick={() => handleOperator('+')}>+</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;