export function bfsearch(grid, startNode, finishNode, heuristic) {
    const visitedNodesInOrder = [];
    if (heuristic === 'Manhattan' || heuristic === 'Heuristic') {
        startNode.distance = calculateManhattan(startNode, finishNode);
    }
    else if (heuristic === 'Euclidien') {
        startNode.distance = calculateEuclidien(startNode, finishNode);
    }
    else if (heuristic === 'Chebyshev') {
        startNode.distance = calculateChebyshev(startNode, finishNode);
    }
    else {
        startNode.distance = calculateOctile(startNode, finishNode);
    }
    const unvisitedNodes = getAllNodes(grid);
    while (!!unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes);
        //console.log(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        // If we encounter a wall, we skip it.
        if (closestNode.isWall) continue;
        // If the closest node is at a distance of infinity,
        // we must be trapped and should therefore stop.
        if (closestNode.distance === Infinity) return visitedNodesInOrder;
        closestNode.isVisited = true;
        //visitedNodesInOrder.push(closestNode);
        if (closestNode === finishNode) return visitedNodesInOrder;
        updateUnvisitedNeighbors(closestNode, grid, visitedNodesInOrder, startNode, finishNode, heuristic);
    }
}

function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function calculateManhattan(neighbor, finishNode) {
    const x = Math.abs(finishNode.row - neighbor.row);
    const y = Math.abs(finishNode.col - neighbor.col);
    const retval = x + y;
    return retval;
}

function calculateEuclidien(neighbor, finishNode) {
    const x = finishNode.row - neighbor.row;
    const y = finishNode.col - neighbor.col;
    const retval = Math.sqrt(x * x + y * y);
    return retval;
}

function calculateChebyshev(neighbor, finishNode) {
    const x = Math.abs(finishNode.row - neighbor.row);
    const y = Math.abs(finishNode.col - neighbor.col);
    const retval = x > y ? x : y;
    return retval;
}

function calculateOctile(neighbor, finishNode) {
    const x = Math.abs(finishNode.row - neighbor.row);
    const y = Math.abs(finishNode.col - neighbor.col);
    const a = 2 - Math.sqrt(2);
    const retval = x > y ? a * x : a * y;
    return retval;
}

function updateUnvisitedNeighbors(node, grid, visitedNodesInOrder, startNode, finishNode, heuristic) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        if (!neighbor.isWall && !neighbor.isFinish) visitedNodesInOrder.push(neighbor);
        // neighbor.distance = calculateEuclidien(neighbor, finishNode);
        if (heuristic === "Manhattan" || heuristic === "Heuristic") {
            neighbor.distance = calculateManhattan(neighbor, finishNode);
        }
        else if (heuristic === 'Euclidien') {
            neighbor.distance = calculateEuclidien(neighbor, finishNode);
        }
        else if (heuristic === 'Chebyshev') {
            neighbor.distance = calculateChebyshev(neighbor, finishNode);
        }
        else {
            neighbor.distance = calculateOctile(neighbor, finishNode);
        }
        neighbor.previousNode = node;
    }
}

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}

export function getNodesInShortestPathOrderbfsearch(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}