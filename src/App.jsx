import React, { useState, useEffect, useRef } from "react";
import "./App.css";

// Heuristic function for A* algorithm
const heuristic = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);

// Custom A* algorithm for all directions
const astarAllDirections = (graph, start, end) => {
  const openSet = [];
  openSet.push({ cost: 0, position: start });
  const cameFrom = new Map();
  const gScore = {};
  const fScore = {};
  const infinity = Infinity;

  for (const node in graph) {
    gScore[node] = infinity;
    fScore[node] = infinity;
  }
  gScore[start] = 0;
  fScore[start] = heuristic(
    start.split(",").map(Number),
    end.split(",").map(Number)
  );

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.cost - b.cost);
    const current = openSet.shift().position;

    if (current === end) {
      const path = [];
      let temp = current;
      while (cameFrom.has(temp)) {
        path.push(temp);
        temp = cameFrom.get(temp);
      }
      path.push(start);
      path.reverse();
      return path;
    }

    const neighbors = getAllNeighbors(graph, current);
    for (const neighbor of neighbors) {
      const tentativeGScore = gScore[current] + graph[current][neighbor].weight;
      if (tentativeGScore < gScore[neighbor]) {
        cameFrom.set(neighbor, current);
        gScore[neighbor] = tentativeGScore;
        fScore[neighbor] =
          gScore[neighbor] +
          heuristic(
            neighbor.split(",").map(Number),
            end.split(",").map(Number)
          );
        if (!openSet.some((node) => node.position === neighbor)) {
          openSet.push({ cost: fScore[neighbor], position: neighbor });
        }
      }
    }
  }
  return null;
};

// Function to get all neighbors including diagonals
const getAllNeighbors = (graph, position) => {
  const [x, y] = position.split(",").map(Number);
  const directions = [
    [-1, 0],
    [1, 0], // up, down
    [0, -1],
    [0, 1], // left, right
    [-1, -1],
    [-1, 1], // up-left, up-right
    [1, -1],
    [1, 1], // down-left, down-right
  ];

  const neighbors = [];
  for (const [dx, dy] of directions) {
    const neighborX = x + dx;
    const neighborY = y + dy;
    const neighbor = `${neighborX},${neighborY}`;
    if (graph[neighbor]) {
      neighbors.push(neighbor);
    }
  }
  return neighbors;
};

// Generate weather data
const generateWeatherData = (gridSize) => {
  const weatherData = {};
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      weatherData[`${x},${y}`] = {
        windSpeed: Math.floor(Math.random() * 31),
        waveHeight: Math.random() * 5,
        danger: Math.random() < 0.1, // Reduced probability of danger zones
      };
    }
  }
  return weatherData;
};

// Create graph function with different weight adjustments
const createGraph = (gridSize, weatherData) => {
  const graph = {};
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      const key = `${x},${y}`;
      graph[key] = {};
      const directions = [
        [-1, 0],
        [1, 0], // up, down
        [0, -1],
        [0, 1], // left, right
        [-1, -1],
        [-1, 1], // up-left, up-right
        [1, -1],
        [1, 1], // down-left, down-right
      ];
      for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < gridSize && ny < gridSize) {
          const neighborKey = `${nx},${ny}`;
          const weight = weatherData[neighborKey].danger ? 10 : 1;
          graph[key][neighborKey] = {
            weight: dx !== 0 && dy !== 0 ? weight * Math.sqrt(2) : weight,
          };
        }
      }
    }
  }
  return graph;
};

const App = () => {
  const [gridSize] = useState(10);
  const [weatherData, setWeatherData] = useState(generateWeatherData(gridSize));
  const [paths, setPaths] = useState([]);
  const canvasRef = useRef(null);

  // Function to find paths
  const findPaths = () => {
    const graph = createGraph(gridSize, weatherData);
    const start = "0,0";
    const end = `${gridSize - 1},${gridSize - 1}`;

    const allDirectionPath = astarAllDirections(graph, start, end);
    if (allDirectionPath) {
      setPaths([allDirectionPath]);
    }
  };

  // Function to generate random weather data
  const handleGenerateWeather = () => {
    setWeatherData(generateWeatherData(gridSize));
  };

  // Effect to handle drawing on canvas
  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    const cellSize = canvasRef.current.width / gridSize;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw ocean background
    ctx.fillStyle = "#87CEEB"; // Light Sky Blue
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw weather data (danger zones are marked with red circles)
    Object.keys(weatherData).forEach((key) => {
      const [x, y] = key.split(",").map(Number);
      if (weatherData[key].danger) {
        const centerX = x * cellSize + cellSize / 2;
        const centerY = y * cellSize + cellSize / 2;
        ctx.fillStyle = "rgba(255, 0, 0, 0.5)"; // Semi-transparent red
        ctx.beginPath();
        ctx.arc(centerX, centerY, cellSize / 3, 0, 2 * Math.PI);
        ctx.fill();
      }
    });

    // Draw paths
    const colors = ["blue"];
    paths.forEach((path, pathIndex) => {
      ctx.strokeStyle = colors[pathIndex];
      ctx.lineWidth = 5;
      ctx.beginPath();
      path.forEach((position, index) => {
        const [x, y] = position.split(",").map(Number);
        const cx = x * cellSize + cellSize / 2;
        const cy = y * cellSize + cellSize / 2;
        if (index === 0) {
          ctx.moveTo(cx, cy);
        } else {
          ctx.lineTo(cx, cy);
        }
      });
      ctx.stroke();
    });

    // Draw start and end markers
    ctx.fillStyle = "green"; // Port
    ctx.beginPath();
    ctx.arc(0.5 * cellSize, 0.5 * cellSize, cellSize / 3, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = "red"; // Destination
    ctx.beginPath();
    ctx.arc(
      (gridSize - 0.5) * cellSize,
      (gridSize - 0.5) * cellSize,
      cellSize / 3,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }, [weatherData, paths, gridSize]);

  return (
    <div className="App">
      <h1>Ship Path Finder</h1>
      <button onClick={findPaths}>Find Path</button>
      <button onClick={handleGenerateWeather}>Generate Random Weather</button>
      <canvas ref={canvasRef} width={600} height={600}></canvas>
    </div>
  );
};

export default App;
