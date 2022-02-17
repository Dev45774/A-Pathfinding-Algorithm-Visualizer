import { useEffect, useState } from "react";
import Node from "./Node";
import "./Grid.css";
import { Astar } from "../algorithms/Astar";
import Grid from "./Grid";
import {
  ViewBoardsIcon,
  RefreshIcon,
  PlayIcon,
  TrashIcon,
} from "@heroicons/react/solid";
import { Tooltip } from "@mui/material";

const START_NODE_ROW = 2;
const START_NODE_COL = 2;
const TARGET_NODE_ROW = 15;
const TARGET_NODE_COL = 40;

const createNode = (row, col) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isTarget: row === TARGET_NODE_ROW && col === TARGET_NODE_COL,
    gCost: Infinity,
    hCost: 0,
    fCost: Infinity,
    isWall: false,
    prev: null,
    visited: false,
  };
};

const initGrid = (setGrid) => {
  const gridArray = [];
  for (let i = 0; i < 30; i++) {
    gridArray.push([]);
    for (let k = 0; k < 50; k++) {
      gridArray[i].push(createNode(i, k));
    }
  }
  return gridArray;
};

const AStarVisualizer = () => {
  const [grid, setGrid] = useState([]);
  const [runAStar, setRunAStar] = useState(false);
  const [mouseIsDown, setMouseIsDown] = useState(false);
  const [timeouts, setTimeouts] = useState([]);

  useEffect(() => {
    setGrid(initGrid());
    console.log("sdgdsfg");
  }, []);
  useEffect(() => {}, [grid]);
  useEffect(() => {
    if (runAStar === true) {
      visualizeAStar();
    }
    setRunAStar(false);
  }, [runAStar]);

  const visualizeAStar = () => {
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", grid);
    const AstarResult = Astar(
      grid[START_NODE_ROW][START_NODE_COL],
      grid[TARGET_NODE_ROW][TARGET_NODE_COL],
      grid.slice()
    );
    console.log(AstarResult);
    for (let i = 0; i < AstarResult.visitedNodesInOrder.length; i++) {
      const newGrid = grid.slice();
      const newTimeout = setTimeout(() => {
        const node = AstarResult.visitedNodesInOrder[i];

        newGrid[node.row][node.col].visited = true;
        setGrid(newGrid);
      }, 60 * i);
      setTimeouts((timeouts) => [...timeouts, newTimeout]);
    }
    if (AstarResult.pathToTarget) {
      for (let i = 0; i < AstarResult.pathToTarget.length; i++) {
        const newGrid = grid.slice();
        const newTimeout = setTimeout(() => {
          const node = AstarResult.pathToTarget[i];

          newGrid[node.row][node.col].isShortestPath = true;
          setGrid(newGrid);
        }, AstarResult.visitedNodesInOrder.length * 60 + 50 * i);
        setTimeouts((timeouts) => [...timeouts, newTimeout]);
      }
    }
  };
  /*   console.log(grid);

  console.log(AstarResult); */
  return (
    <div className="grid__container">
      <div className="grid__buttons space-x-1 py-2">
        <Tooltip title={<p>Run</p>}>
          <a
            className="p-5 hover:bg-gray-400 cursor-pointer bg-gray-300 font-semibold"
            onClick={async () => {
              await setGrid(
                grid.map((row) =>
                  row.map((node) => ({
                    ...node,
                    visited: false,
                    isShortestPath: false,
                  }))
                )
              );
              setRunAStar(true);
            }}
          >
            <PlayIcon className="h-10 w-10 text-gray-800" />
          </a>
        </Tooltip>
        <Tooltip title="Generate walls">
          <a
            className="p-2 hover:bg-gray-400 cursor-pointer bg-gray-300 font-semibold flex items-center"
            onClick={() => {
              const newGrid = initGrid().map((row) =>
                row.map((node) => {
                  if (Math.random() < 0.5 || node.isStart || node.isTarget)
                    return node;
                  return {
                    ...node,
                    isWall: true,
                  };
                })
              );
              setGrid(newGrid);
            }}
          >
            <RefreshIcon className="w-8 h-8 text-gray-800" />
            <ViewBoardsIcon className="h-8 w-8 text-gray-800" />
          </a>
        </Tooltip>
        <Tooltip title="Reset">
          <a
            className="p-5 hover:bg-gray-400 cursor-pointer bg-gray-300 font-semibold"
            onClick={() => {
              console.log(timeouts);
              timeouts.forEach((timeout) => {
                clearTimeout(timeout);
              });
              setTimeouts([]);

              setGrid(initGrid());
            }}
          >
            <TrashIcon className="h-10 w-10 text-gray-800" />
          </a>
        </Tooltip>
      </div>
      {/*  <p className="instructions">Click & Drag to Create Walls</p>
       */}
      {grid.length > 0 && (
        <Grid
          grid={grid}
          mouseIsDown={mouseIsDown}
          setMouseIsDown={setMouseIsDown}
          setGrid={setGrid}
        />
      )}
    </div>
  );
};

export default AStarVisualizer;
