import React, { Component } from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';
import { astar, getNodesInShortestPathOrderAstar } from '../algorithms/astar';
import { bfsearch, getNodesInShortestPathOrderbfsearch } from '../algorithms/bfsearch';
import { Navbar, Nav, Button, NavDropdown } from 'react-bootstrap';
import './PathfindingVisualizer.css';

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      algorithm: 'Select Algorithm',
      heuristic: 'Heuristic',
    };
  }

  componentDidMount() {
    this.getInitialGrid();
  }

  getInitialGrid() {
    const width = window.innerWidth,
      height = window.innerHeight;
    const max_cols = Math.round((width - 100) / 20);
    var max_rows = Math.round((height - 300) / 20);
    const grid = [];
    for (let row = 0; row < max_rows; row++) {
      const currentRow = [];
      for (let col = 0; col < max_cols; col++) {
        currentRow.push(createNode(col, row));
      }
      grid.push(currentRow);
    }
    this.setState({ grid });
    // this.forceUpdate();
  }

  handleMouseDown(row, col) {
    const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  randomGrid() {
    const width = window.innerWidth,
      height = window.innerHeight;
    const max_cols = Math.round((width - 100) / 20);
    const max_rows = Math.round((height - 300) / 20);
    const snr = Math.round(max_rows / 2);
    const fnr = snr;
    const snc = Math.round(max_cols / 4);
    const fnc = Math.round(snc * 3);
    const n = (max_cols * max_rows * 3) / 4;
    var newGrid = this.state.grid;
    for (let i = 0; i < n; i++) {
      const r = randomIntFromInterval(0, max_rows - 1);
      const c = randomIntFromInterval(0, max_cols - 1);
      if (snc === c && snr === r) continue;
      if (fnc === c && fnr === r) continue;
      newGrid = this.getNewGridWithWallToggled(newGrid, r, c);
    }
    this.setState({ grid: newGrid });
  }

  getNewGridWithWallToggled(grid, row, col) {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  }

  animateVisited(visitedNodesInOrder, nodesInShortestPathOrder, time) {
    if (visitedNodesInOrder.length === 0) {
      const message = document.getElementById('msg');
      message.style.color = "red";
      message.innerHTML = "<b>No path found Reset</b> grid and try again ";
      return;
    }
    for (let i = 1; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder, visitedNodesInOrder, time);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        // const newGrid = this.state.grid;
        // const node = newGrid[row][col];
        // const newNode = {
        //   ...node,
        //   isVisited: true,
        // };
        // newGrid[node.row][node.col] = newNode;
        // this.setState({ grid: newGrid });
        // return newGrid;
        if (i < visitedNodesInOrder.length - 1) document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder, visitedNodesInOrder, time) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
      setTimeout(() => {
        const message = document.getElementById('msg');
        if (nodesInShortestPathOrder.length === 1) {
          console.log("here2");
          message.style.color = "red";
          message.innerHTML = "<b>No path found Reset</b> grid and try again ";
          return;
        }
        message.innerHTML = "Use <b>Reset grid</b> button and visualize again <b>(Visited nodes: " + visitedNodesInOrder.length + "___Path length: " + nodesInShortestPathOrder.length + "___Execution Time: " + time + "ms )</b>";
      }, 50 * nodesInShortestPathOrder.length);
    }
  }

  visualizeDijkstra() {
    const { grid } = this.state;
    document.getElementById('msg').innerHTML = "<b>Dijkstra's Algorithm</b> guarantees shortest path";
    document.getElementById('rm').setAttribute("disabled", "disabled");
    document.getElementById('vb').setAttribute("disabled", "disabled");
    const width = window.innerWidth,
      height = window.innerHeight;
    const max_cols = Math.round((width - 100) / 20);
    const max_rows = Math.round((height - 300) / 20);
    const snr = Math.round(max_rows / 2);
    const fnr = snr;
    const snc = Math.round(max_cols / 4);
    const fnc = Math.round(snc * 3);
    const startNode = grid[snr][snc];
    const finishNode = grid[fnr][fnc];
    var start = new Date().getTime();
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    var end = new Date().getTime();
    var time = end - start;
    this.animateVisited(visitedNodesInOrder, nodesInShortestPathOrder, time);
  }

  visualizeAstar() {
    const { grid } = this.state;
    document.getElementById('msg').innerHTML = "<b>Astar's Algorithm is informed search algorithm</b>";
    document.getElementById('vb').setAttribute("disabled", "disabled");
    document.getElementById('rm').setAttribute("disabled", "disabled");
    const width = window.innerWidth,
      height = window.innerHeight;
    const max_cols = Math.round((width - 100) / 20);
    const max_rows = Math.round((height - 300) / 20);
    const snr = Math.round(max_rows / 2);
    const fnr = snr;
    const snc = Math.round(max_cols / 4);
    const fnc = Math.round(snc * 3);
    const startNode = grid[snr][snc];
    const finishNode = grid[fnr][fnc];
    var start = new Date().getTime();
    const visitedNodesInOrder = astar(grid, startNode, finishNode, this.state.heuristic);
    const nodesInShortestPathOrder = getNodesInShortestPathOrderAstar(finishNode);
    var end = new Date().getTime();
    var time = end - start;
    this.animateVisited(visitedNodesInOrder, nodesInShortestPathOrder, time);
  }

  visuailzeBFSearch() {
    const { grid } = this.state;
    document.getElementById('msg').innerHTML = "<b>Best_First Search</b>";
    document.getElementById('vb').setAttribute("disabled", "disabled");
    document.getElementById('rm').setAttribute("disabled", "disabled");
    const width = window.innerWidth,
      height = window.innerHeight;
    const max_cols = Math.round((width - 100) / 20);
    const max_rows = Math.round((height - 300) / 20);
    const snr = Math.round(max_rows / 2);
    const fnr = snr;
    const snc = Math.round(max_cols / 4);
    const fnc = Math.round(snc * 3);
    const startNode = grid[snr][snc];
    const finishNode = grid[fnr][fnc];
    var start = new Date().getTime();
    const visitedNodesInOrder = bfsearch(grid, startNode, finishNode, this.state.heuristic);
    const nodesInShortestPathOrder = getNodesInShortestPathOrderbfsearch(finishNode);
    var end = new Date().getTime();
    var time = end - start;
    this.animateVisited(visitedNodesInOrder, nodesInShortestPathOrder, time);
  }

  visualize() {
    const algo = this.state.algorithm;
    if (algo === 'Select Algorithm') {
      document.getElementById('msg').innerHTML = "<b>First select an algorithm</b>";
    }
    else if (algo === 'Dijkstra\'s Algorithm') {
      this.visualizeDijkstra();
    }
    else if (algo === 'Astar\'s Algorithm') {
      this.visualizeAstar();
    }
    else if (algo === 'Best_First Search') {
      this.visuailzeBFSearch();
    }
    else {
      this.visualizeBDAstar();
    }
  }

  render() {
    const { grid, mouseIsPressed } = this.state;
    return (
      <>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="#home">Pathfinding-Visaulizer</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ml-auto">
              <NavDropdown title={this.state.algorithm}>
                <NavDropdown.Item as="button" onClick={() => this.setState({ algorithm: 'Dijkstra\'s Algorithm' })}>Dijkstra's algorithm</NavDropdown.Item>
                <NavDropdown.Item as="button" onClick={() => this.setState({ algorithm: 'Astar\'s Algorithm' })}>Astar's search algorithm</NavDropdown.Item>
                < NavDropdown.Item as="button" onClick={() => this.setState({ algorithm: 'Best_First Search' })}>Greedy Best first search</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title={this.state.heuristic}>
                <NavDropdown.Item as="button" onClick={() => this.setState({ heuristic: 'Manhattan' })}>Manhattan</NavDropdown.Item>
                <NavDropdown.Item as="button" onClick={() => this.setState({ heuristic: 'Euclidiean' })}>Euclidiean</NavDropdown.Item>
                <NavDropdown.Item as="button" onClick={() => this.setState({ heuristic: 'Chebyshev' })}>Chebyshev</NavDropdown.Item>
                <NavDropdown.Item as="button" onClick={() => this.setState({ heuristic: 'Octile' })}>Octile</NavDropdown.Item>
              </NavDropdown>
              <Button id="vb" onClick={() => this.visualize()} variant="dark">Visualize</Button>
              <Button id="rm" onClick={() => this.randomGrid()} variant="dark">Random maze</Button>
              {/* <Button id="trial" onClick={() => this.getInitialGrid()} variant="dark">Clear Animations</Button> */}
              <Button id="rg" onClick={() => window.location.reload(false)} variant="dark">Reset Grid</Button>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className="row">
          <div className="column">
            <div
              display="inline-block"
              style={{
                width: "15px",
                height: "15px",
                backgroundColor: "white",
                outline: "1px solid rgb(175, 216, 248)",
                boxShadow: "0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24)",
                marginLeft: "20px",
              }}
            ></div>
          </div>
          <div className="column">
            Unvisited Node
          </div>
          <div className="column">
            <div
              display="inline-block"
              style={{
                width: "15px",
                height: "15px",
                backgroundColor: "rgba(0, 190, 218, 0.75)",
                outline: "1px solid rgb(175, 216, 248)",
                boxShadow: "0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24)",
                marginLeft: "20px",
              }}
            ></div>
          </div>
          <div className="column">
            Visited Node
          </div>
          <div className="column">
            <div
              display="inline-block"
              style={{
                width: "15px",
                height: "15px",
                backgroundColor: " rgb(12, 53, 71)",
                outline: "1px solid rgb(175, 216, 248)",
                boxShadow: "0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24)",
                marginLeft: "20px",
              }}
            ></div>
          </div>
          <div className="column">
            Wall Node
          </div>
          <div className="column">
            <div
              display="inline-block"
              style={{
                width: "15px",
                height: "15px",
                backgroundColor: "green",
                outline: "1px solid rgb(175, 216, 248)",
                boxShadow: "0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24)",
                marginLeft: "20px",
              }}
            ></div>
          </div>
          <div className="column">
            Start Node
          </div>
          <div className="column">
            <div
              display="inline-block"
              style={{
                width: "15px",
                height: "15px",
                backgroundColor: "red",
                outline: "1px solid rgb(175, 216, 248)",
                boxShadow: "0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24)",
                marginLeft: "20px",
              }}
            ></div>
          </div>
          <div className="column">
            End Node
          </div>
          <div className="column">
            <div
              display="inline-block"
              style={{
                width: "15px",
                height: "15px",
                backgroundColor: "yellow",
                outline: "1px solid rgb(175, 216, 248)",
                boxShadow: "0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24)",
                marginLeft: "20px",
              }}
            ></div>
          </div>
          <div className="column">
            Path Node
          </div>
        </div>
        <p id="msg" text-align="center" style={{ margin: "35px 0 10px 0", fontSize: "17px" }}>Add <b>walls</b> using your <b>cursor</b> and visualize a algorithm</p>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx} style={{ color: "white" }}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <>
                      <Node
                        key={nodeIdx}
                        col={col}
                        isFinish={isFinish}
                        isStart={isStart}
                        isWall={isWall}
                        mouseIsPressed={mouseIsPressed}
                        onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                        onMouseEnter={(row, col) =>
                          this.handleMouseEnter(row, col)
                        }
                        onMouseUp={() => this.handleMouseUp()}
                        row={row}></Node>
                    </>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}


const createNode = (col, row) => {

  const width = window.innerWidth,
    height = window.innerHeight;
  const max_cols = Math.round((width - 100) / 20);
  const max_rows = Math.round((height - 300) / 20);
  const snr = Math.round(max_rows / 2);
  const fnr = snr;
  const snc = Math.round(max_cols / 4);
  const fnc = Math.round(snc * 3);
  return {
    col,
    row,
    isStart: row === snr && col === snc,
    isFinish: row === fnr && col === fnc,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};
