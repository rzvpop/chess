// add square matrix?

class Table {
    constructor() {
        this.table = null;
        this._pieces = [[null], [null], [null], [null], [null], [null], [null], [null], [null]];
        this._checkPositions = [[null], [null], [null], [null], [null], [null], [null], [null], [null]];
        this._selected = null;
        this._turn = "white";
        this._blockedForWhiteKing = [];
        this._blockedForBlackKing = [];
    }

    get pieces() {
        return this._pieces;
    }

    set pieces(value) {
        this._pieces = value;
    }

    get selected() {
        return this._selected;
    }

    set selected(value) {
        this._selected = value;
    }

    /**
     *
     * @param row
     * @param column
     * @returns {Element}
     * @private
     */
    _getSquareByCoordinates(row, column) {
        return $($(this.table).children()[8 * (row - 1) + (column - 1)]);
    }

    _putSquares() {
        if (this.table !== null) {
            for (let i = 1; i <= 8; ++i) {
                for (let j = 1; j <= 8; ++j) {
                    this.table.append($("<div/>").addClass(((i + j) % 2 === 0) ? "white-square" : "brown-square")
                            .css("grid-row", i + " / " + (i + 1))
                            .css("grid-column", j + " / " + (j + 1))
                            .click((event) => {
                                    this._moveFlow(i, j);
                            }));

                    this._pieces[i].push(null);
                    this._checkPositions[i].push(null);
                }
            }
        }
    }

    addPiece(row, column, piece) {
        if (this._pieces[row][column] === null) {
            this._pieces[row][column] = piece;
            this._getSquareByCoordinates(row, column).append(piece.generatePieceDiv());
        }
    }

    movePiece(rowStart, columnStart, rowEnd, columnEnd) {
        const piece = this._pieces[rowStart][columnStart];
        const endPiece = this._pieces[rowEnd][columnEnd];

        const $squareDiv = this._getSquareByCoordinates(rowStart, columnStart);
        const $pieceDiv = $squareDiv.children()[0];
        const $endSquareDiv = this._getSquareByCoordinates(rowEnd, columnEnd);

        if (typeof piece !== "undefined" && piece !== null) {
            const moveSet = piece.getMoveContext().generateAlternatives(this, rowStart, columnStart);

            if (moveSet.find(square => square.row === rowEnd && square.column === columnEnd)) {
                if (endPiece !== null) {
                    $endSquareDiv.children()[0].remove();
                    this._cleanHighlight();
                }

                $pieceDiv.remove();
                $endSquareDiv.append($pieceDiv);
            }

            this._pieces[rowStart][columnStart] = null;
            this._pieces[rowEnd][columnEnd] = piece;

            if(piece.constructor.name === "Pawn") piece.firstDone = true;
        }
    }

    generateTable(element) {
        this.table = $("<div/>").prependTo(element).addClass("chess-table");
        this._putSquares();

        $("<div id='turn'/>").prependTo(element).html("<p>" + this._turn + "'s turn</p>")
    }

    chooseMove(row, column) {
        if (this._selected) {
            // if(this._pieces[this._selected.row][this._selected.column].constructor.name === "King") {
            //     this._selected.moveSet = this._selected.moveSet.filter(move => !this._checkPositions[move.row][move.column] === this._pieces[this._selected.row][this._selected.column].color);
            // }
            if (this._selected.moveSet.find(move => move.row === row && move.column === column && !move.isKing)) {
                this.movePiece(this._selected.row, this._selected.column, row, column);
                this._turn = this._turn === "white" ? "black" : "white";
                $("#turn").html("<p>" + this._turn + "'s turn</p>")
            }
        }
    }

    // see alternatives, choose move, see if in check
    _moveFlow(row, column) {
        const $currentSquare = this._getSquareByCoordinates(row, column);

        if ($currentSquare.children().length > 0 && !this._selected && this._pieces[row][column].color === this._turn) {
            this._highlightAlternatives(row, column, $currentSquare);
        }
        else {
            if(this._selected && (row !== this._selected.row || column !== this._selected.column)) {
                this.chooseMove(row, column);
                this._highlightCheck(row, column);
            }

            if(this.selected) {
                this._cleanHighlight();
                this._selected = null;
            }
        }

    }

    _highlightAlternatives(row, column, currentSquare) {
        this._cleanHighlight();
        $(currentSquare).addClass("select-piece");

        let moveSet = this._pieces[row][column].getMoveContext().generateAlternatives(this, row, column);
        if(this._pieces[row][column].constructor.name === "King") {
            moveSet = moveSet.filter(move => this._checkPositions[move.row][move.column] !== this._pieces[row][column].color);
        }

        moveSet.forEach(move => {
            if(!move.isKing)
                if (move.canCapture)
                    this._getSquareByCoordinates(move.row, move.column).addClass("can-capture");
                else
                    this._getSquareByCoordinates(move.row, move.column).addClass("move-alternative");
        });

        this._selected = {row: row, column: column, moveSet: moveSet};
    }

    _highlightCheck() {
        let foundKing = false;

        for(let i = 1; i <= 8; ++i)
            for(let j = 1; j <= 8; ++j) {
                const piece = this._pieces[i][j];
                this._checkPositions[i][j] = null;
                if(piece !== null) {
                    const moveSet = piece.getMoveContext().generateAlternatives(this, i, j);
                    moveSet.forEach(move => {
                        if (move.isKing) {
                            this._getSquareByCoordinates(move.row, move.column).addClass("check");
                            foundKing = true;
                        }
                        else {
                            this._checkPositions[move.row][move.column] = this._pieces[i][j].color === "white" ? "black" : "white";
                        }
                    });
                }
            }

        if(!foundKing) {
            this.table.children().removeClass("check");
        }
    }

    _cleanHighlight() {
        this.table.children().removeClass("select-piece");
        this.table.children().removeClass("move-alternative");
        this.table.children().removeClass("can-capture");
    }
}