import "./Node.css";
const getAdditionalStyle = (node) => {
  let style;
  if (!node.isTarget && !node.isStart) {
    if (node.unvisited) {
      style = "node--unvisited";
    }
    if (node.visited) {
      style = "node--visited";
    }
  } else if (node.isTarget) {
    style = "node--target";
  } else if (node.isStart) {
    style = "node--start";
  }
  if (node.isShortestPath) {
    style = "node--shortestPath";
  }
  if (node.isWall) {
    style = "node--wall";
  }
  return style;
};
const Node = ({ node, setGrid, grid, mouseIsDown, setMouseIsDown }) => {
  return (
    <div className="grid-col">
      <div
        onMouseEnter={() => {
          if (!mouseIsDown || node.isTarget || node.isStart) {
            return;
          }

          const newNode = { ...node, isWall: !node.isWall };
          let newGrid = grid.slice();
          newGrid[node.row][node.col] = newNode;
          setGrid(newGrid);
        }}
        onMouseUp={() => {
          setMouseIsDown(false);
        }}
        onMouseDown={() => {
          setMouseIsDown(true);
          if (node.isTarget || node.isStart) {
            return;
          }
          const newNode = { ...node, isWall: !node.isWall };
          let newGrid = grid.slice();
          newGrid[node.row][node.col] = newNode;
          setGrid(newGrid);
        }}
        className={`node ${getAdditionalStyle(node)}`}
      ></div>
    </div>
  );
};

export default Node;
