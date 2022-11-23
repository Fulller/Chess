const Size = window.innerWidth - 10 > 480 ? 480 : window.innerWidth - 10;
const BLOCK_SIZE = Size / 8;
const SELECTCOLOR = "rgb(140, 245, 79)";
let canvas = document.querySelector("#chessboard");
let ctx = canvas.getContext("2d");
canvas.width = Size;
canvas.height = Size;
let bg = document.querySelector("#bg");
let chessS = document.querySelectorAll(".chess-piece");
let step = document.querySelector("#step");

let Grid = [
  [3, 4, 5, 2, 1, 5, 4, 3],
  [6, 6, 6, 6, 6, 6, 6, 6],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [12, 12, 12, 12, 12, 12, 12, 12],
  [9, 10, 11, 8, 7, 11, 10, 9],
];
function Piece(id, { x, y }) {
  this.onSelect = false;
  this.id = id;
  this.img = chessS[id];
  if (id <= 6) {
    this.color = "black";
  } else {
    this.color = "white";
  }
  this.position = {
    x: x,
    y: y,
  };
}
class Board {
  constructor(ctx, grid, canvas) {
    this.dom = canvas;
    this.ctx = ctx;
    this.pieces = this.initPieces(grid);
    this.grid = grid;
    this.mouse = {
      x: 0,
      y: 0,
    };
    this.pieceSelect = null;
    this.nextmove = [];
    this.step = "white";
    this.gameOver = { isGameOver: false, win: "white" };
  }
  rePlay(grid) {
    this.pieces = this.initPieces(grid);
    this.grid = grid;
    this.mouse = {
      x: 0,
      y: 0,
    };
    this.pieceSelect = null;
    this.nextmove = [];
    this.step = "white";
    this.gameOver = { isGameOver: false, win: "white" };
  }
  initPieces(grid) {
    let result = [];
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (grid[y][x] != 0) {
          result.push(new Piece(grid[y][x], { x, y }));
        }
      }
    }
    return result;
  }
  drawPiece({ img, position }) {
    this.ctx.drawImage(
      img,
      BLOCK_SIZE * position.x,
      BLOCK_SIZE * position.y,
      BLOCK_SIZE,
      BLOCK_SIZE
    );
  }
  updateGrid() {
    this.grid = Array.from({ length: 8 }, () => Array(8).fill(0));
    for (let i of this.pieces) {
      this.grid[i.position.y][i.position.x] = i.id;
    }
  }
  drawPieces() {
    this.ctx.clearRect(0, 0, Size, Size);
    for (let i of this.pieces) {
      if (i.onSelect == true) {
        this.ctx.fillStyle = SELECTCOLOR;
        this.ctx.fillRect(
          this.mouse.x * BLOCK_SIZE,
          this.mouse.y * BLOCK_SIZE,
          BLOCK_SIZE,
          BLOCK_SIZE
        );
      }
      this.drawPiece(i);
    }
  }
  drawNextPosition(x, y) {
    this.ctx.beginPath();
    this.ctx.arc(
      x * BLOCK_SIZE + BLOCK_SIZE / 2,
      y * BLOCK_SIZE + BLOCK_SIZE / 2,
      10,
      0,
      2 * Math.PI
    );
    this.ctx.fill();
  }
  createNextmove(piece) {
    let that = this;
    function Position(x, y) {
      this.x = x;
      this.y = y;
    }
    if (piece.color == "black") {
      switch (piece.id) {
        case 1: {
          this.nextmove = [
            new Position(piece.position.x - 1, piece.position.y),
            new Position(piece.position.x - 1, piece.position.y - 1),
            new Position(piece.position.x, piece.position.y - 1),
            new Position(piece.position.x + 1, piece.position.y - 1),
            new Position(piece.position.x + 1, piece.position.y),
            new Position(piece.position.x + 1, piece.position.y + 1),
            new Position(piece.position.x, piece.position.y + 1),
            new Position(piece.position.x - 1, piece.position.y + 1),
          ];
          this.nextmove = this.nextmove.filter((p) => {
            return (
              p.x >= 0 &&
              p.x <= 7 &&
              p.y >= 0 &&
              p.y <= 7 &&
              (that.grid[p.y][p.x] > 6 || that.grid[p.y][p.x] == 0)
            );
          });
          break;
        }
        case 2: {
          this.nextmove = [];
          let nextPosition = new Position(
            piece.position.x - 1,
            piece.position.y
          );
          while (
            nextPosition.x >= 0 &&
            this.grid[nextPosition.y][nextPosition.x] == 0
          ) {
            this.nextmove.push(nextPosition);
            nextPosition = new Position(nextPosition.x - 1, nextPosition.y);
          }
          if (
            nextPosition.x >= 0 &&
            this.grid[nextPosition.y][nextPosition.x] > 6
          ) {
            this.nextmove.push(nextPosition);
          }
          nextPosition = new Position(piece.position.x, piece.position.y + 1);
          while (
            nextPosition.y <= 7 &&
            this.grid[nextPosition.y][nextPosition.x] == 0
          ) {
            this.nextmove.push(nextPosition);
            nextPosition = new Position(nextPosition.x, nextPosition.y + 1);
          }
          if (
            nextPosition.y <= 7 &&
            this.grid[nextPosition.y][nextPosition.x] > 6
          ) {
            this.nextmove.push(nextPosition);
          }
          nextPosition = new Position(piece.position.x + 1, piece.position.y);
          while (
            nextPosition.x <= 7 &&
            this.grid[nextPosition.y][nextPosition.x] == 0
          ) {
            this.nextmove.push(nextPosition);
            nextPosition = new Position(nextPosition.x + 1, nextPosition.y);
          }
          if (
            nextPosition.x <= 7 &&
            this.grid[nextPosition.y][nextPosition.x] > 6
          ) {
            this.nextmove.push(nextPosition);
          }
          nextPosition = new Position(piece.position.x, piece.position.y - 1);
          while (
            nextPosition.y >= 0 &&
            this.grid[nextPosition.y][nextPosition.x] == 0
          ) {
            this.nextmove.push(nextPosition);
            nextPosition = new Position(nextPosition.x, nextPosition.y - 1);
          }
          if (
            nextPosition.y >= 0 &&
            this.grid[nextPosition.y][nextPosition.x] > 6
          ) {
            this.nextmove.push(nextPosition);
          }
          //
          nextPosition = new Position(
            piece.position.x + 1,
            piece.position.y + 1
          );
          while (nextPosition.x <= 7 && nextPosition.y <= 7) {
            if (this.grid[nextPosition.y][nextPosition.x] == 0) {
              this.nextmove.push(nextPosition);
            } else {
              if (this.grid[nextPosition.y][nextPosition.x] > 6) {
                this.nextmove.push(nextPosition);
              }
              break;
            }
            nextPosition = new Position(nextPosition.x + 1, nextPosition.y + 1);
          }
          nextPosition = new Position(
            piece.position.x - 1,
            piece.position.y + 1
          );
          while (nextPosition.x >= 0 && nextPosition.y <= 7) {
            if (this.grid[nextPosition.y][nextPosition.x] == 0) {
              this.nextmove.push(nextPosition);
            } else {
              if (this.grid[nextPosition.y][nextPosition.x] > 6) {
                this.nextmove.push(nextPosition);
              }
              break;
            }
            nextPosition = new Position(nextPosition.x - 1, nextPosition.y + 1);
          }
          nextPosition = new Position(
            piece.position.x - 1,
            piece.position.y - 1
          );
          while (nextPosition.x >= 0 && nextPosition.y >= 0) {
            if (this.grid[nextPosition.y][nextPosition.x] == 0) {
              this.nextmove.push(nextPosition);
            } else {
              if (this.grid[nextPosition.y][nextPosition.x] > 6) {
                this.nextmove.push(nextPosition);
              }
              break;
            }
            nextPosition = new Position(nextPosition.x - 1, nextPosition.y - 1);
          }
          nextPosition = new Position(
            piece.position.x + 1,
            piece.position.y - 1
          );
          while (nextPosition.x <= 7 && nextPosition.y >= 0) {
            if (this.grid[nextPosition.y][nextPosition.x] == 0) {
              this.nextmove.push(nextPosition);
            } else {
              if (this.grid[nextPosition.y][nextPosition.x] > 6) {
                this.nextmove.push(nextPosition);
              }
              break;
            }
            nextPosition = new Position(nextPosition.x + 1, nextPosition.y - 1);
          }
          break;
        }
        case 3: {
          this.nextmove = [];
          let nextPosition = new Position(
            piece.position.x - 1,
            piece.position.y
          );
          while (
            nextPosition.x >= 0 &&
            this.grid[nextPosition.y][nextPosition.x] == 0
          ) {
            this.nextmove.push(nextPosition);
            nextPosition = new Position(nextPosition.x - 1, nextPosition.y);
          }
          if (
            nextPosition.x >= 0 &&
            this.grid[nextPosition.y][nextPosition.x] > 6
          ) {
            this.nextmove.push(nextPosition);
          }
          nextPosition = new Position(piece.position.x, piece.position.y + 1);
          while (
            nextPosition.y <= 7 &&
            this.grid[nextPosition.y][nextPosition.x] == 0
          ) {
            this.nextmove.push(nextPosition);
            nextPosition = new Position(nextPosition.x, nextPosition.y + 1);
          }
          if (
            nextPosition.y <= 7 &&
            this.grid[nextPosition.y][nextPosition.x] > 6
          ) {
            this.nextmove.push(nextPosition);
          }
          nextPosition = new Position(piece.position.x + 1, piece.position.y);
          while (
            nextPosition.x <= 7 &&
            this.grid[nextPosition.y][nextPosition.x] == 0
          ) {
            this.nextmove.push(nextPosition);
            nextPosition = new Position(nextPosition.x + 1, nextPosition.y);
          }
          if (
            nextPosition.x <= 7 &&
            this.grid[nextPosition.y][nextPosition.x] > 6
          ) {
            this.nextmove.push(nextPosition);
          }
          nextPosition = new Position(piece.position.x, piece.position.y - 1);
          while (
            nextPosition.y >= 0 &&
            this.grid[nextPosition.y][nextPosition.x] == 0
          ) {
            this.nextmove.push(nextPosition);
            nextPosition = new Position(nextPosition.x, nextPosition.y - 1);
          }
          if (
            nextPosition.y >= 0 &&
            this.grid[nextPosition.y][nextPosition.x] > 6
          ) {
            this.nextmove.push(nextPosition);
          }
          break;
        }
        case 4: {
          this.nextmove = [
            new Position(piece.position.x + 1, piece.position.y - 2),
            new Position(piece.position.x + 2, piece.position.y - 1),
            new Position(piece.position.x + 2, piece.position.y + 1),
            new Position(piece.position.x + 1, piece.position.y + 2),
            new Position(piece.position.x - 1, piece.position.y + 2),
            new Position(piece.position.x - 2, piece.position.y + 1),
            new Position(piece.position.x - 2, piece.position.y - 1),
            new Position(piece.position.x - 1, piece.position.y - 2),
          ];
          this.nextmove = this.nextmove.filter((p) => {
            return (
              p.x >= 0 &&
              p.x <= 7 &&
              p.y >= 0 &&
              p.y <= 7 &&
              (that.grid[p.y][p.x] > 6 || that.grid[p.y][p.x] == 0)
            );
          });
          break;
        }
        case 5: {
          this.nextmove = [];
          let nextPosition;
          nextPosition = new Position(
            piece.position.x + 1,
            piece.position.y + 1
          );
          while (nextPosition.x <= 7 && nextPosition.y <= 7) {
            if (this.grid[nextPosition.y][nextPosition.x] == 0) {
              this.nextmove.push(nextPosition);
            } else {
              if (this.grid[nextPosition.y][nextPosition.x] > 6) {
                this.nextmove.push(nextPosition);
              }
              break;
            }
            nextPosition = new Position(nextPosition.x + 1, nextPosition.y + 1);
          }
          nextPosition = new Position(
            piece.position.x - 1,
            piece.position.y + 1
          );
          while (nextPosition.x >= 0 && nextPosition.y <= 7) {
            if (this.grid[nextPosition.y][nextPosition.x] == 0) {
              this.nextmove.push(nextPosition);
            } else {
              if (this.grid[nextPosition.y][nextPosition.x] > 6) {
                this.nextmove.push(nextPosition);
              }
              break;
            }
            nextPosition = new Position(nextPosition.x - 1, nextPosition.y + 1);
          }
          nextPosition = new Position(
            piece.position.x - 1,
            piece.position.y - 1
          );
          while (nextPosition.x >= 0 && nextPosition.y >= 0) {
            if (this.grid[nextPosition.y][nextPosition.x] == 0) {
              this.nextmove.push(nextPosition);
            } else {
              if (this.grid[nextPosition.y][nextPosition.x] > 6) {
                this.nextmove.push(nextPosition);
              }
              break;
            }
            nextPosition = new Position(nextPosition.x - 1, nextPosition.y - 1);
          }
          nextPosition = new Position(
            piece.position.x + 1,
            piece.position.y - 1
          );
          while (nextPosition.x <= 7 && nextPosition.y >= 0) {
            if (this.grid[nextPosition.y][nextPosition.x] == 0) {
              this.nextmove.push(nextPosition);
            } else {
              if (this.grid[nextPosition.y][nextPosition.x] > 6) {
                this.nextmove.push(nextPosition);
              }
              break;
            }
            nextPosition = new Position(nextPosition.x + 1, nextPosition.y - 1);
          }
          break;
        }
        case 6: {
          this.nextmove = [
            new Position(piece.position.x, piece.position.y + 1),
          ];
          if (piece.position.y == 1 && this.grid[2][piece.position.x] == 0) {
            this.nextmove.push(
              new Position(piece.position.x, piece.position.y + 2)
            );
          }
          this.nextmove = this.nextmove.filter((p) => {
            return this.grid[p.y][p.x] == 0;
          });
          let slant = [
            new Position(piece.position.x - 1, piece.position.y + 1),
            new Position(piece.position.x + 1, piece.position.y + 1),
          ];
          slant = slant.filter((p) => {
            return this.grid[p.y][p.x] > 6;
          });
          this.nextmove.push(...slant);
          break;
        }
      }
    } else {
      switch (piece.id) {
        case 7: {
          this.nextmove = [
            new Position(piece.position.x - 1, piece.position.y),
            new Position(piece.position.x - 1, piece.position.y - 1),
            new Position(piece.position.x, piece.position.y - 1),
            new Position(piece.position.x + 1, piece.position.y - 1),
            new Position(piece.position.x + 1, piece.position.y),
            new Position(piece.position.x + 1, piece.position.y + 1),
            new Position(piece.position.x, piece.position.y + 1),
            new Position(piece.position.x - 1, piece.position.y + 1),
          ];
          this.nextmove = this.nextmove.filter((p) => {
            return (
              p.x >= 0 &&
              p.x <= 7 &&
              p.y >= 0 &&
              p.y <= 7 &&
              (that.grid[p.y][p.x] < 7 || that.grid[p.y][p.x] == 0)
            );
          });
          break;
        }
        case 8: {
          this.nextmove = [];
          let nextPosition = new Position(
            piece.position.x - 1,
            piece.position.y
          );
          while (
            nextPosition.x >= 0 &&
            this.grid[nextPosition.y][nextPosition.x] == 0
          ) {
            this.nextmove.push(nextPosition);
            nextPosition = new Position(nextPosition.x - 1, nextPosition.y);
          }
          if (
            nextPosition.x >= 0 &&
            this.grid[nextPosition.y][nextPosition.x] < 7
          ) {
            this.nextmove.push(nextPosition);
          }
          nextPosition = new Position(piece.position.x, piece.position.y + 1);
          while (
            nextPosition.y <= 7 &&
            this.grid[nextPosition.y][nextPosition.x] == 0
          ) {
            this.nextmove.push(nextPosition);
            nextPosition = new Position(nextPosition.x, nextPosition.y + 1);
          }
          if (
            nextPosition.y <= 7 &&
            this.grid[nextPosition.y][nextPosition.x] < 7
          ) {
            this.nextmove.push(nextPosition);
          }
          nextPosition = new Position(piece.position.x + 1, piece.position.y);
          while (
            nextPosition.x <= 7 &&
            this.grid[nextPosition.y][nextPosition.x] == 0
          ) {
            this.nextmove.push(nextPosition);
            nextPosition = new Position(nextPosition.x + 1, nextPosition.y);
          }
          if (
            nextPosition.x <= 7 &&
            this.grid[nextPosition.y][nextPosition.x] < 7
          ) {
            this.nextmove.push(nextPosition);
          }
          nextPosition = new Position(piece.position.x, piece.position.y - 1);
          while (
            nextPosition.y >= 0 &&
            this.grid[nextPosition.y][nextPosition.x] == 0
          ) {
            this.nextmove.push(nextPosition);
            nextPosition = new Position(nextPosition.x, nextPosition.y - 1);
          }
          if (
            nextPosition.y >= 0 &&
            this.grid[nextPosition.y][nextPosition.x] < 7
          ) {
            this.nextmove.push(nextPosition);
          }
          //
          nextPosition = new Position(
            piece.position.x + 1,
            piece.position.y + 1
          );
          while (nextPosition.x <= 7 && nextPosition.y <= 7) {
            if (this.grid[nextPosition.y][nextPosition.x] == 0) {
              this.nextmove.push(nextPosition);
            } else {
              if (this.grid[nextPosition.y][nextPosition.x] < 7) {
                this.nextmove.push(nextPosition);
              }
              break;
            }
            nextPosition = new Position(nextPosition.x + 1, nextPosition.y + 1);
          }
          nextPosition = new Position(
            piece.position.x - 1,
            piece.position.y + 1
          );
          while (nextPosition.x >= 0 && nextPosition.y <= 7) {
            if (this.grid[nextPosition.y][nextPosition.x] == 0) {
              this.nextmove.push(nextPosition);
            } else {
              if (this.grid[nextPosition.y][nextPosition.x] < 7) {
                this.nextmove.push(nextPosition);
              }
              break;
            }
            nextPosition = new Position(nextPosition.x - 1, nextPosition.y + 1);
          }
          nextPosition = new Position(
            piece.position.x - 1,
            piece.position.y - 1
          );
          while (nextPosition.x >= 0 && nextPosition.y >= 0) {
            if (this.grid[nextPosition.y][nextPosition.x] == 0) {
              this.nextmove.push(nextPosition);
            } else {
              if (this.grid[nextPosition.y][nextPosition.x] < 7) {
                this.nextmove.push(nextPosition);
              }
              break;
            }
            nextPosition = new Position(nextPosition.x - 1, nextPosition.y - 1);
          }
          nextPosition = new Position(
            piece.position.x + 1,
            piece.position.y - 1
          );
          while (nextPosition.x <= 7 && nextPosition.y >= 0) {
            if (this.grid[nextPosition.y][nextPosition.x] == 0) {
              this.nextmove.push(nextPosition);
            } else {
              if (this.grid[nextPosition.y][nextPosition.x] < 7) {
                this.nextmove.push(nextPosition);
              }
              break;
            }
            nextPosition = new Position(nextPosition.x + 1, nextPosition.y - 1);
          }
          break;
        }
        case 9: {
          this.nextmove = [];
          let nextPosition = new Position(
            piece.position.x - 1,
            piece.position.y
          );
          while (
            nextPosition.x >= 0 &&
            this.grid[nextPosition.y][nextPosition.x] == 0
          ) {
            this.nextmove.push(nextPosition);
            nextPosition = new Position(nextPosition.x - 1, nextPosition.y);
          }
          if (
            nextPosition.x >= 0 &&
            this.grid[nextPosition.y][nextPosition.x] < 7
          ) {
            this.nextmove.push(nextPosition);
          }
          nextPosition = new Position(piece.position.x, piece.position.y + 1);
          while (
            nextPosition.y <= 7 &&
            this.grid[nextPosition.y][nextPosition.x] == 0
          ) {
            this.nextmove.push(nextPosition);
            nextPosition = new Position(nextPosition.x, nextPosition.y + 1);
          }
          if (
            nextPosition.y <= 7 &&
            this.grid[nextPosition.y][nextPosition.x] < 7
          ) {
            this.nextmove.push(nextPosition);
          }
          nextPosition = new Position(piece.position.x + 1, piece.position.y);
          while (
            nextPosition.x <= 7 &&
            this.grid[nextPosition.y][nextPosition.x] == 0
          ) {
            this.nextmove.push(nextPosition);
            nextPosition = new Position(nextPosition.x + 1, nextPosition.y);
          }
          if (
            nextPosition.x <= 7 &&
            this.grid[nextPosition.y][nextPosition.x] < 7
          ) {
            this.nextmove.push(nextPosition);
          }
          nextPosition = new Position(piece.position.x, piece.position.y - 1);
          while (
            nextPosition.y >= 0 &&
            this.grid[nextPosition.y][nextPosition.x] == 0
          ) {
            this.nextmove.push(nextPosition);
            nextPosition = new Position(nextPosition.x, nextPosition.y - 1);
          }
          if (
            nextPosition.y >= 0 &&
            this.grid[nextPosition.y][nextPosition.x] < 7
          ) {
            this.nextmove.push(nextPosition);
          }
          break;
        }
        case 10: {
          this.nextmove = [
            new Position(piece.position.x + 1, piece.position.y - 2),
            new Position(piece.position.x + 2, piece.position.y - 1),
            new Position(piece.position.x + 2, piece.position.y + 1),
            new Position(piece.position.x + 1, piece.position.y + 2),
            new Position(piece.position.x - 1, piece.position.y + 2),
            new Position(piece.position.x - 2, piece.position.y + 1),
            new Position(piece.position.x - 2, piece.position.y - 1),
            new Position(piece.position.x - 1, piece.position.y - 2),
          ];
          this.nextmove = this.nextmove.filter((p) => {
            return (
              p.x >= 0 &&
              p.x <= 7 &&
              p.y >= 0 &&
              p.y <= 7 &&
              (that.grid[p.y][p.x] < 7 || that.grid[p.y][p.x] == 0)
            );
          });
          break;
        }
        case 11: {
          this.nextmove = [];
          let nextPosition;
          nextPosition = new Position(
            piece.position.x + 1,
            piece.position.y + 1
          );
          while (nextPosition.x <= 7 && nextPosition.y <= 7) {
            if (this.grid[nextPosition.y][nextPosition.x] == 0) {
              this.nextmove.push(nextPosition);
            } else {
              if (this.grid[nextPosition.y][nextPosition.x] < 7) {
                this.nextmove.push(nextPosition);
              }
              break;
            }
            nextPosition = new Position(nextPosition.x + 1, nextPosition.y + 1);
          }
          nextPosition = new Position(
            piece.position.x - 1,
            piece.position.y + 1
          );
          while (nextPosition.x >= 0 && nextPosition.y <= 7) {
            if (this.grid[nextPosition.y][nextPosition.x] == 0) {
              this.nextmove.push(nextPosition);
            } else {
              if (this.grid[nextPosition.y][nextPosition.x] < 7) {
                this.nextmove.push(nextPosition);
              }
              break;
            }
            nextPosition = new Position(nextPosition.x - 1, nextPosition.y + 1);
          }
          nextPosition = new Position(
            piece.position.x - 1,
            piece.position.y - 1
          );
          while (nextPosition.x >= 0 && nextPosition.y >= 0) {
            if (this.grid[nextPosition.y][nextPosition.x] == 0) {
              this.nextmove.push(nextPosition);
            } else {
              if (this.grid[nextPosition.y][nextPosition.x] < 7) {
                this.nextmove.push(nextPosition);
              }
              break;
            }
            nextPosition = new Position(nextPosition.x - 1, nextPosition.y - 1);
          }
          nextPosition = new Position(
            piece.position.x + 1,
            piece.position.y - 1
          );
          while (nextPosition.x <= 7 && nextPosition.y >= 0) {
            if (this.grid[nextPosition.y][nextPosition.x] == 0) {
              this.nextmove.push(nextPosition);
            } else {
              if (this.grid[nextPosition.y][nextPosition.x] < 7) {
                this.nextmove.push(nextPosition);
              }
              break;
            }
            nextPosition = new Position(nextPosition.x + 1, nextPosition.y - 1);
          }
          break;
        }
        case 12: {
          if (piece.position.y != 0) {
            this.nextmove = [
              new Position(piece.position.x, piece.position.y - 1),
            ];
            if (piece.position.y == 6 && this.grid[5][piece.position.x] == 0) {
              this.nextmove.push(
                new Position(piece.position.x, piece.position.y - 2)
              );
            }
            this.nextmove = this.nextmove.filter((p) => {
              return this.grid[p.y][p.x] == 0;
            });
            let slant = [
              new Position(piece.position.x - 1, piece.position.y - 1),
              new Position(piece.position.x + 1, piece.position.y - 1),
            ];
            slant = slant.filter((p) => {
              return this.grid[p.y][p.x] < 7 && this.grid[p.y][p.x] != 0;
            });
            this.nextmove.push(...slant);
          }
          break;
        }
      }
    }
    for (let i of this.nextmove) {
      this.drawNextPosition(i.x, i.y);
    }
  }
  checkGameOver(that) {
    let KingBlack = that.pieces.find((p) => {
      return p.id == 1;
    });
    let KingWhite = that.pieces.find((p) => {
      return p.id == 7;
    });
    if (KingBlack && KingWhite) {
      that.gameOver = { isGameOver: false, win: null };
    } else {
      if (KingBlack) {
        that.gameOver = { isGameOver: true, win: "black" };
      } else {
        that.gameOver = { isGameOver: true, win: "white" };
      }
    }
  }
  handleEvent() {
    let that = this;
    this.dom.onmousemove = function (e) {
      that.mouse.x = Math.floor(e.offsetX / BLOCK_SIZE);
      that.mouse.y = Math.floor(e.offsetY / BLOCK_SIZE);
    };
    this.dom.onclick = function (e) {
      if (that.gameOver.isGameOver) {
        that.rePlay(Grid);
        that.play();
        return;
      }
      let PieceSelect = null;
      let PieceNext = null;
      that.pieces.forEach((piece) => {
        if (
          piece.position.x == that.mouse.x &&
          piece.position.y == that.mouse.y
        ) {
          piece.onSelect = !piece.onSelect;
          PieceSelect = piece;
        } else {
          piece.onSelect = false;
        }
      });
      that.nextmove.forEach((piece) => {
        if (piece.x == that.mouse.x && piece.y == that.mouse.y) {
          PieceNext = piece;
          return;
        }
      });
      if (PieceNext) {
        if (that.grid[PieceNext.y][PieceNext.x] != 0) {
          that.pieces = that.pieces.filter((piece, index) => {
            return (
              piece.position.x != PieceNext.x || piece.position.y != PieceNext.y
            );
          });
        }
        if (PieceNext.y == 0 && that.pieceSelect.id == 12) {
          that.pieceSelect.id = 8;
          that.pieceSelect.img = chessS[8];
        } else if (PieceNext.y == 7 && that.pieceSelect.id == 6) {
          that.pieceSelect.id = 2;
          that.pieceSelect.img = chessS[2];
        }
        that.pieceSelect.position.x = PieceNext.x;
        that.pieceSelect.position.y = PieceNext.y;
        that.nextmove = [];
        that.updateGrid();
        that.drawPieces();
        that.checkGameOver(that);
        that.step == "white" ? (that.step = "black") : (that.step = "white");
        step.innerText = that.step.toUpperCase();
        if (that.gameOver.isGameOver) {
          setTimeout(() => {
            GameOver(that, that.gameOver.win, that.ctx, that.canvas);
          }, 500);
        }
        return;
      }
      if (PieceSelect) {
        that.drawPieces();
        that.drawPiece(PieceSelect);
        if (PieceSelect.onSelect) {
          that.pieceSelect = PieceSelect;
          if (PieceSelect.color == that.step) {
            that.createNextmove(PieceSelect);
          }
        } else {
          that.pieceSelect = null;
        }
      }
    };
  }
  play() {
    setTimeout(() => {
      this.drawPieces();
    }, 200);
    this.handleEvent();
  }
}
board = new Board(ctx, Grid, canvas);
board.play();
function GameOver(board, win, ctx, canvas) {
  ctx.fillStyle = win;
  ctx.fillRect(
    BLOCK_SIZE,
    BLOCK_SIZE * 3,
    BLOCK_SIZE * 6,
    (BLOCK_SIZE * 3) / 2
  );
  ctx.font = " bold  48px Lora";
  if (win == "white") {
    ctx.fillStyle = "black";
  } else {
    ctx.fillStyle = "white";
  }
  ctx.fillText(win.toUpperCase() + " WINER", BLOCK_SIZE, Size / 2);
  ctx.strokeText(win.toUpperCase() + " WINER", BLOCK_SIZE, Size / 2);
  ctx.strokeStyle = ctx.fillStyle;
  ctx.strokeRect(
    BLOCK_SIZE,
    BLOCK_SIZE * 3,
    BLOCK_SIZE * 6,
    (BLOCK_SIZE * 3) / 2
  );
}
