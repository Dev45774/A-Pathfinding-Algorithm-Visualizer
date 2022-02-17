export const Astar = (startNode, targetNode, initialGrid) => {
  let grid = initialGrid.map((row) => {
    return row.map((node) => {
      if (node.isTarget) {
        console.log(node, "gfdsgsdf");
        return { ...node };
      }
      const newNode = {
        ...node,
        hCost: calculateDistToTarget(
          node.row,
          node.col,
          targetNode.col,
          targetNode.row
        ),
      };
      return newNode;
    });
  });

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
    //console.log(openNodes);

    curr = openNodes.shift();
    visitedNodes.push(curr);
    if (curr.col === targetNode.col && curr.row === targetNode.row) {
      return {
        visitedNodesInOrder: visitedNodes,
        pathToTarget: getPathToTarget(curr),
      };
    }
    const neighbours = getNeighbours(curr, grid, visitedNodes, openNodes);

    openNodes = openNodes.concat(neighbours);
  }
  return {
    visitedNodesInOrder: visitedNodes,
    pathToTarget: null,
  };
};

const getNeighbours = (curr, grid, visitedNodes, openNodes) => {
  let neighbours = findNeighbours(curr, grid);
  neighbours = filterNeighbours(neighbours, visitedNodes, openNodes);

  return neighbours;
};

const filterNeighbours = (neighbours, visitedNodes, openNodes) => {
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
    // filter nodes already in openNodes Array
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

const findNeighbours = (curr, grid) => {
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
    if (col < grid[0].length - 1) {
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
  if (col < grid[0].length - 1) {
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

const calculateDistToTarget = (row, col, TARGET_NODE_COL, TARGET_NODE_ROW) => {
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
