// add square matrix?

class Table {
    constructor() {
        this.table = null;
        this._pieces = [[], [], [], [], [], [], [], []];
    }

    get pieces() {
        return this._pieces;
    }

    set pieces(value) {
        this._pieces = value;
    }

    _getSquareByCoordinates(row, column) {
        return this.table.children[8 * (row - 1) + column - 1];
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
                    square.style.gridColumn = j + " / " + (j + 1);
                    square.addEventListener("mouseover", (event) => {this.showAlternatives(i, j)});
                    square.addEventListener("mouseout", (event) => {square.classList.remove("hoverPiece");});

                    this._pieces[i - 1].push(null);
                }
            }
        }
    }

    addPiece(row, column, piece) {
        this._pieces[row][column] = piece;
        this.table.children[(row - 1) * 8 + column - 1].appendChild(piece.generatePieceDiv());
    }

    movePiece(rowStart, columnStart, rowEnd, columnEnd) {
        const piece = this._pieces[rowStart][columnStart];
        const endPiece = this._pieces[rowEnd][columnEnd];

        const squareDiv = this.table.children[(rowStart - 1) * 8 + columnStart - 1];
        const pieceDiv = squareDiv.firstChild;
        const endSquareDiv = this.table.children[(rowEnd - 1) * 8 + columnEnd - 1];

        if(typeof piece !== "undefined" && piece !== null)
        {
            const moveSet = piece.moveContext.generateAlternatives(this, rowStart, columnStart);

            if(moveSet.find(square => square.row === rowEnd && square.column === columnEnd) !== undefined)
            {
                if(endPiece !== null)
                    endSquareDiv.removeChild(endSquareDiv.firstChild);

                squareDiv.removeChild(pieceDiv);
                endSquareDiv.appendChild(pieceDiv);
            }
        }
    }

    generateTable(html) {
        this.table = document.createElement("div");
        this.table.classList.add("chess-table");

        this._putSquares();
        html.appendChild(this.table);
    }

    showAlternatives(row, column) {
        const currentSquare = this._getSquareByCoordinates(row, column);

        if(currentSquare.hasChildNodes())
        {
            currentSquare.classList.add("hoverPiece");
            
            const possibleSquares = this._pieces[row][column].getMoveContext().generateAlternatives(this, row, column).map(pair => this._getSquareByCoordinates(pair.row, pair.column));
            possibleSquares.forEach(square => {
                square.classList.add("moveAlternative");
            });
        }
    }
}