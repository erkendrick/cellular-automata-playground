import React, { useRef, useEffect, useState, useCallback } from 'react';
import Rules from './Rules';

const CELL_SIZE = 5;
const FPS = 32;
const FRAME_DURATION = 1000 / FPS;

function Canvas({ isPaused, onReset, currentRule }) {
  const canvasRef = useRef(null);
  const gridRef = useRef([]);
  const animationFrameId = useRef(null);
  const lastUpdateTimeRef = useRef(0);
  const [isPainting, setIsPainting] = useState(false);
  const cursorPositionRef = useRef({ x: 0, y: 0 });

  const getColor = useCallback((x, width) => {
    const normalizedX = x / width;
    
    const r = Math.floor(50 + (normalizedX * 150));
    const g = 50;
    const b = Math.floor(200 + (normalizedX * 55));
  
    return `rgb(${r},${g},${b})`;
  }, []);

  const drawGrid = useCallback((context, grid, width, height) => {
    context.fillStyle = '#000000';
    context.fillRect(0, 0, width, height);
    
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j]) {
          const x = i * CELL_SIZE;
          const y = j * CELL_SIZE;
          context.fillStyle = getColor(x, width);
          context.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        }
      }
    }
  }, [getColor]);

  const initializeGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cols = Math.floor(canvas.width / CELL_SIZE);
    const rows = Math.floor(canvas.height / CELL_SIZE);
    gridRef.current = Array(cols).fill().map(() => Array(rows).fill(0));

    drawGrid(canvas.getContext('2d'), gridRef.current, canvas.width, canvas.height);
  }, [drawGrid]);

  const computeNextGeneration = useCallback(() => {
    const grid = gridRef.current;
    return grid.map((col, i) => col.map((cell, j) => {
      const neighbors = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], /*[0, 0],*/ [0, 1],
        [1, -1], [1, 0], [1, 1]
      ].reduce((acc, [dx, dy]) => {
        const x = (i + dx + grid.length) % grid.length;
        const y = (j + dy + grid[0].length) % grid[0].length;
        return acc + grid[x][y];
      }, 0);

      return Rules[currentRule](cell, neighbors);
    }));
  }, [currentRule]);

  const paintCells = useCallback((x, y) => {
    const gridX = Math.floor(x / CELL_SIZE);
    const gridY = Math.floor(y / CELL_SIZE);

    const grid = gridRef.current;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newX = (gridX + i + grid.length) % grid.length;
        const newY = (gridY + j + grid[0].length) % grid[0].length;
        grid[newX][newY] = 1;
      }
    }
  }, []);

  const animate = useCallback((currentTime) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');

    if (isPainting) {
      const { x, y } = cursorPositionRef.current;
      paintCells(x, y);
    }

    if (!isPaused && currentTime - lastUpdateTimeRef.current >= FRAME_DURATION) {
      gridRef.current = computeNextGeneration();
      lastUpdateTimeRef.current = currentTime;
    }

    drawGrid(context, gridRef.current, canvas.width, canvas.height);
    animationFrameId.current = requestAnimationFrame(animate);
  }, [isPaused, isPainting, computeNextGeneration, drawGrid, paintCells]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const resizeCanvas = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        initializeGrid();
      };

      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();

      return () => window.removeEventListener('resize', resizeCanvas);
    }
  }, [initializeGrid]);

  useEffect(() => {
    onReset(initializeGrid);
  }, [onReset, initializeGrid]);

  useEffect(() => {
    lastUpdateTimeRef.current = performance.now();
    animationFrameId.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId.current);
  }, [animate]);

  const handleMouseDown = useCallback((event) => {
    setIsPainting(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      cursorPositionRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    }
  }, []);

  const handleMouseMove = useCallback((event) => {
    if (isPainting) {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        cursorPositionRef.current = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        };
      }
    }
  }, [isPainting]);

  const handleTouchStart = useCallback((event) => {
    event.preventDefault();
    setIsPainting(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const touch = event.touches[0];
      cursorPositionRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    }
  }, []);

  const handleTouchMove = useCallback((event) => {
    event.preventDefault();
    if (isPainting) {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const touch = event.touches[0];
        cursorPositionRef.current = {
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top
        };
      }
    }
  }, [isPainting]);

  const stopPainting = useCallback(() => {
    setIsPainting(false);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseup', stopPainting);
      canvas.addEventListener('mouseleave', stopPainting);
      canvas.addEventListener('touchstart', handleTouchStart);
      canvas.addEventListener('touchmove', handleTouchMove);
      canvas.addEventListener('touchend', stopPainting);

      return () => {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseup', stopPainting);
        canvas.removeEventListener('mouseleave', stopPainting);
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchmove', handleTouchMove);
        canvas.removeEventListener('touchend', stopPainting);
      };
    }
  }, [handleMouseDown, handleMouseMove, handleTouchStart, handleTouchMove, stopPainting]);

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} />
    </div>
  );
}

export default Canvas;