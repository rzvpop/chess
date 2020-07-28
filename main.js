class Table {
    constructor() {
        this.table = null;
        this.pieces = [[], [], [], [], [], [], [], []];
    }

    _putSquares() {
        if (this.table !== null) {
            for (let i = 1; i <= 8; ++i) {
                for (let j = 1; j <= 8; ++j) {
                    const square = document.createElement("div");
                    if ((i + j) % 2 === 0)
                        square.classList.add('white-square');
                    else
                        square.classList.add('brown-square');

                    this.table.appendChild(square);
                    square.style.gridRow = i + " / " + (i + 1);
                    square.style.gridRow = j + " / " + (j + 1);
                }
            }
        }
    }

    addPiece(row, column, pawn) {
        this.pieces[row][column] = pawn;
        this.table.children[(column - 1) * 8 + row - 1].appendChild(pawn.generatePieceDiv());
    }

    generateTable(html) {
        this.table = document.createElement("div");
        this.table.classList.add("chess-table");

        this._putSquares();
        html.appendChild(this.table);
    }
}

class ChessPiece {
    constructor(color) {
        this.color = color;

        if (this.constructor.name === "ChessPiece") {
            throw "Piece is abstract.";
        }
    }

    generatePieceDiv() {
        return "";
    }
}

class Pawn extends ChessPiece {
    constructor(color) {
        super(color);
    }

    generatePieceDiv() {
        const pawn = document.createElement("div");
        pawn.innerHTML = "pawn";

        return pawn;
    }
}

const table = new Table();
table.generateTable(document.body);

const pawn = new Pawn("white");
table.addPiece(3, 5, pawn);