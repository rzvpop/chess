// add square matrix?

class Table {
    constructor() {
        this.table = null;
        this._pieces = [[null], [null], [null], [null], [null], [null], [null], [null], [null]];
        this._selected = null;
    }

    get pieces() {
        return this._pieces;
    }

    set pieces(value) {
        this._pieces = value;
    }

    /**
     *
     * @param row
     * @param column
     * @returns {Element}
     * @private
     */
    _getSquareByCoordinates(row, column) {
        return this.table.children[8 * (row - 1) + (column - 1)];
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
                    square.addEventListener("click", (event) => {
                        this._highlightAlternatives(i, j);
                    });

                    this._pieces[i].push(null);
                }
            }
        }
    }

    addPiece(row, column, piece) {
        if (this._pieces[row][column] === null) {
            this._pieces[row][column] = piece;
            this._getSquareByCoordinates(row, column).appendChild(piece.generatePieceDiv());
        }
    }

    movePiece(rowStart, columnStart, rowEnd, columnEnd) {
        const piece = this._pieces[rowStart][columnStart];
        const endPiece = this._pieces[rowEnd][columnEnd];

        const squareDiv = this._getSquareByCoordinates(rowStart, columnStart);
        const pieceDiv = squareDiv.firstChild;
        const endSquareDiv = this._getSquareByCoordinates(rowEnd, columnEnd);

        if (typeof piece !== "undefined" && piece !== null) {
            const moveSet = piece.getMoveContext().generateAlternatives(this, rowStart, columnStart);

            if (moveSet.find(square => square.row === rowEnd && square.column === columnEnd)) {
                if (endPiece !== null) {
                    endSquareDiv.removeChild(endSquareDiv.firstChild);
                    this._cleanHighlight();
                }

                squareDiv.removeChild(pieceDiv);
                endSquareDiv.appendChild(pieceDiv);
            }

            this._pieces[rowStart][columnStart] = null;
            this._pieces[rowEnd][columnEnd] = piece;
        }
    }

    generateTable(html) {
        this.table = document.createElement("div");
        this.table.classList.add("chess-table");

        this._putSquares();
        html.appendChild(this.table);
    }

    chooseMove(row, column) {
        if (this._selected) {
            if (this._selected.moveSet.find(move => move.row === row && move.column === column)) {
                this.movePiece(this._selected.row, this._selected.column, row, column);
                return true;
            }
        }
        return false;
    }

    // move choice also here
    _highlightAlternatives(row, column) {
        const currentSquare = this._getSquareByCoordinates(row, column);

        if (currentSquare.hasChildNodes() && !this._selected) {
            this._noSelectedCase(row, column, currentSquare);
        }
        else {
            if(this._selected && (row !== this._selected.row || column !== this._selected.column)) {
                this.chooseMove(row, column);
            }

            this._cleanHighlight();
            this._selected = null;
        }

    }

    _noSelectedCase(row, column, currentSquare) {
        this._cleanHighlight();
        currentSquare.classList.add("select-piece");

        const moveSet = this._pieces[row][column].getMoveContext().generateAlternatives(this, row, column);
        moveSet.forEach(move => {
            if (move.canCapture)
                this._getSquareByCoordinates(move.row, move.column).classList.add("can-capture");
            else
                this._getSquareByCoordinates(move.row, move.column).classList.add("move-alternative");
        });

        this._selected = {row: row, column: column, moveSet: moveSet};
    }

    _cleanHighlight() {
        for (let i = 0; i < this.table.children.length; ++i) {
            this.table.children[i].classList.remove("select-piece");
            this.table.children[i].classList.remove("move-alternative");
            this.table.children[i].classList.remove("can-capture");
        }
    }
}