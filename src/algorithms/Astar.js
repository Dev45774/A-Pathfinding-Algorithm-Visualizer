export const Astar = (startNode, targetNode, grid) => {
  let visitedNodes = [];
  let openNodes = [];
  let curr;
  openNodes.push(startNode);
  startNode.gCost = 0;
  while (openNodes.length > 0) {
    openNodes = openNodes.sort((a, b) => {
      const res = a.hCost + a.gCost - (b.hCost + b.gCost);
      if (res === 0) {
        return a.hCost - b.hCost;
      } else return res;
    });

    curr = openNodes.shift();

    if (curr.col === targetNode.col && curr.row === targetNode.row) {
      return {
        visitedNodesInOrder: visitedNodes,
        pathToTarget: getPathToTarget(curr),
      };
    }
    const neighbours = addNeighbours(curr, grid, visitedNodes, openNodes);

    openNodes = openNodes.concat(neighbours);

    visitedNodes.push(curr);
  }
  return {
    visitedNodesInOrder: visitedNodes,
    pathToTarget: null,
  };
};

const addNeighbours = (curr, grid, visitedNodes, openNodes) => {
  let neighbours = getNeighbours(curr, grid);
  neighbours = neighbours.filter((n) => {
    // filter visited nodes from neighbours
    const result = visitedNodes.find(
      (node) => node.col === n.col && node.row === n.row
    );

    if (result === undefined || result === null) {
      return true;
    } else return false;
  });
  neighbours = neighbours.filter((n) => {
    // filter visited nodes from neighbours
    const result = openNodes.find(
      (node) => node.col === n.col && node.row === n.row
    );

    if (result === undefined || result === null) {
      if (n.isWall) {
        return false;
      } else {
        return true;
      }
    } else return false;
  });

  return neighbours;
};

const getNeighbours = (curr, grid) => {
  let neighbours = [];

  const { row, col } = curr;

  if (row > 0) {
    neighbours.push({
      ...grid[row - 1][col],
      gCost:
        curr.gCost + 10 < grid[row - 1][col].gCost
          ? curr.gCost + 10
          : grid[row - 1][col].gCost,
      prev:
        curr.gCost + 10 < grid[row - 1][col].gCost
          ? curr
          : grid[row - 1][col.prev],
    });
    if (col > 0) {
      neighbours.push({
        ...grid[row - 1][col - 1],
        gCost:
          curr.gCost + 14 < grid[row - 1][col - 1].gCost
            ? curr.gCost + 14
            : grid[row - 1][col - 1].gCost,
        prev:
          curr.gCost + 14 < grid[row - 1][col - 1].gCost
            ? curr
            : grid[row - 1][col - 1].prev,
      });
    }
    if (col < grid[0].length - 1) {
      neighbours.push({
        ...grid[row - 1][col + 1],
        gCost:
          curr.gCost + 14 < grid[row - 1][col + 1].gCost
            ? curr.gCost + 14
            : grid[row - 1][col + 1].gCost,
        prev:
          curr.gCost + 14 < grid[row - 1][col + 1].gCost
            ? curr
            : grid[row - 1][col + 1].prev,
      });
    }
  }
  if (row < grid.length - 1) {
    neighbours.push({
      ...grid[row + 1][col],
      gCost:
        curr.gCost + 10 < grid[row + 1][col].gCost
          ? curr.gCost + 10
          : grid[row + 1][col].gCost,
      prev:
        curr.gCost + 10 < grid[row + 1][col].gCost
          ? curr
          : grid[row + 1][col].prev,
    });
    if (col > 0) {
      neighbours.push({
        ...grid[row + 1][col - 1],
        gCost:
          curr.gCost + 14 < grid[row + 1][col - 1].gCost
            ? curr.gCost + 14
            : grid[row + 1][col - 1].gCost,
        prev:
          curr.gCost + 14 < grid[row + 1][col - 1].gCost
            ? curr
            : grid[row + 1][col - 1].prev,
      });
    }
    if (col < grid.length - 1) {
      neighbours.push({
        ...grid[row + 1][col + 1],
        gCost:
          curr.gCost + 14 < grid[row + 1][col + 1].gCost
            ? curr.gCost + 14
            : grid[row + 1][col + 1].gCost,
        prev:
          curr.gCost + 14 < grid[row + 1][col + 1].gCost
            ? curr
            : grid[row + 1][col + 1].prev,
      });
    }
  }
  if (col > 0) {
    neighbours.push({
      ...grid[row][col - 1],
      gCost:
        curr.gCost + 10 < grid[row][col - 1].gCost
          ? curr.gCost + 10
          : grid[row][col - 1].gCost,
      prev:
        curr.gCost + 10 < grid[row][col - 1].gCost
          ? curr
          : grid[row][col - 1].prev,
    });
  }
  if (col < grid.length - 1) {
    neighbours.push({
      ...grid[row][col + 1],
      gCost:
        curr.gCost + 10 < grid[row][col + 1].gCost
          ? curr.gCost + 10
          : grid[row][col + 1].gCost,
      prev:
        curr.gCost + 10 < grid[row][col + 1].gCost
          ? curr
          : grid[row][col + 1].prev,
    });
  }
  return neighbours;
};

const getPathToTarget = (target) => {
  let path = [];
  let curr = target;
  path.push(curr);

  while (curr !== undefined && curr !== null) {
    path.unshift(curr.prev);
    curr = curr.prev;
  }

  return path;
};
