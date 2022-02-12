import { useEffect, useState } from "react";
import Node from "./Node";
import "./Grid.css";
import { Astar } from "../algorithms/Astar";

const START_NODE_ROW = 2;
const START_NODE_COL = 2;
const TARGET_NODE_ROW = 15;
const TARGET_NODE_COL = 15;

const calculateDistToTarget = (row, col) => {
  let colDist = Math.abs(col - TARGET_NODE_COL);
  let rowDist = Math.abs(row - TARGET_NODE_ROW);
  if (rowDist === 0) {
    return colDist * 10;
  }
  if (colDist === 0) {
    return rowDist * 10;
  }
  let dist = 0;

  while (colDist > 0 && rowDist > 0) {
    colDist--;
    rowDist--;
    dist += 14;
  }
  if (colDist === 0) {
    while (rowDist > 0) {
      rowDist--;
      dist += 10;
    }
  }
  if (rowDist === 0) {
    while (colDist > 0) {
      colDist--;
      dist += 10;
    }
  }
  return dist;
};

const createNode = (row, col) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isTarget: row === TARGET_NODE_ROW && col === TARGET_NODE_COL,
    gCost: Infinity,
    hCost: calculateDistToTarget(row, col),
    fCost: Infinity,
    isWall: false,
    prev: null,
    visited: false,
  };
};

const initGrid = (setGrid) => {
  const gridArray = [];
  for (let i = 0; i < 20; i++) {
    gridArray.push([]);
    for (let k = 0; k < 20; k++) {
      gridArray[i].push(createNode(i, k));
    }
  }
  return gridArray;
};

const Grid = () => {
  const [grid, setGrid] = useState([]);
  const [runAStar, setRunAStar] = useState(false);
  const [mouseIsDown, setMouseIsDown] = useState(false);

  useEffect(() => {
    setGrid(initGrid());
    console.log("sdgdsfg");
  }, []);
  useEffect(() => {
    console.log(grid);
  }, [grid]);
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
    for (let i = 0; i < AstarResult.visitedNodesInOrder.length; i++) {
      const newGrid = grid.slice();
      setTimeout(() => {
        const node = AstarResult.visitedNodesInOrder[i];

        newGrid[node.row][node.col].visited = true;
        setGrid(newGrid);
      }, 60 * i);
    }
    if (AstarResult.pathToTarget) {
      for (let i = 0; i < AstarResult.pathToTarget.length; i++) {
        const newGrid = grid.slice();
        setTimeout(() => {
          const node = AstarResult.pathToTarget[i];

          newGrid[node.row][node.col].isShortestPath = true;
          setGrid(newGrid);
        }, AstarResult.visitedNodesInOrder.length * 60 + 20 * i);
      }
    }
  };
  /*   console.log(grid);

  console.log(AstarResult); */
  return (
    <div className="grid__container">
      <div className="grid__buttons">
        <a
          className="btn"
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
          Animate
        </a>
        <a
          className="btn"
          onClick={() => {
            setGrid(initGrid());
          }}
        >
          Reset
        </a>
      </div>
      <p className="instructions">Click & Drag to Create Walls</p>
      <div className="grid">
        {grid.map((nodes) => {
          return (
            <div className="row">
              {" "}
              {nodes.map((node, i) => {
                return (
                  <Node
                    mouseIsDown={mouseIsDown}
                    setMouseIsDown={setMouseIsDown}
                    grid={grid}
                    setGrid={setGrid}
                    key={i}
                    node={node}
                  />
                );
              })}{" "}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Grid;
