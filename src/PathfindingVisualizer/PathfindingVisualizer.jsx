import React, { Component } from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';
import { Navbar, Nav, Button } from 'react-bootstrap';
import './PathfindingVisualizer.css';

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }

  componentDidMount() {
    this.getInitialGrid();
  }

  getInitialGrid() {
    const width = window.innerWidth,
      height = window.innerHeight;
    const max_cols = Math.round((width - 100) / 27);
    const max_rows = Math.round((height - 300) / 25);
    const grid = [];
    for (let row = 0; row < max_rows; row++) {
      const currentRow = [];
      for (let col = 0; col < max_cols; col++) {
        currentRow.push(createNode(col, row));
      }
      grid.push(currentRow);
    }
    this.setState({ grid }, () => {
      console.log(grid);
    });
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 1; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (i < visitedNodesInOrder.length - 1) document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
      setTimeout(() => {
        const message = document.getElementById('msg');
        if (nodesInShortestPathOrder.length === 1) {
          message.style.color = "red";
          message.innerHTML = "<b>No path found Reset</b> grid and try again ";
          return;
        }
        message.innerHTML = "Use <b>Reset grid</b> button and visualize again";
      }, 100 * nodesInShortestPathOrder.length);
    }
  }

  visualizeDijkstra() {
    const { grid } = this.state;
    document.getElementById('msg').innerHTML = "<b>Dijkstra's Algorithm</b> guarantees shortest path";
    document.getElementById('da').setAttribute("disabled", "disabled");
    const width = window.innerWidth,
      height = window.innerHeight;
    const max_cols = Math.round((width - 100) / 27);
    const max_rows = Math.round((height - 300) / 25);
    const snr = Math.round(max_rows / 2);
    const fnr = snr;
    const snc = Math.round(max_cols / 4);
    const fnc = Math.round(snc * 3);
    if (fnc === max_cols - 1) {
      fnc -= 1;
    }
    const startNode = grid[snr][snc];
    const finishNode = grid[fnr][fnc];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
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
              <Button id="da" onClick={() => this.visualizeDijkstra()} variant="dark">Dijkstra's Algorithm</Button>{' '}
              <Button onClick={() => window.location.reload(false)} variant="dark">Reset Grid</Button>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className="row">
          <div className="column">
            <div
              display="inline-block"
              style={{
                width: "20px",
                height: "20px",
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
                width: "20px",
                height: "20px",
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
                width: "20px",
                height: "20px",
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
                width: "20px",
                height: "20px",
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
                width: "20px",
                height: "20px",
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
                width: "20px",
                height: "20px",
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
        <p id="msg" text-align="center" style={{ margin: "50px 0 10px 0", fontSize: "17px" }}>Add <b>walls</b> using your <b>cursor</b> and visualize a algorithm</p>
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


const createNode = (col, row) => {

  const width = window.innerWidth,
    height = window.innerHeight;
  const max_cols = Math.round((width - 100) / 27);
  const max_rows = Math.round((height - 300) / 25);
  const snr = Math.round(max_rows / 2);
  const fnr = snr;
  const snc = Math.round(max_cols / 4);
  const fnc = Math.round(snc * 3);
  if (fnc === max_cols - 1) {
    fnc -= 1;
  }
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

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
