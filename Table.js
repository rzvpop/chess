class Table {
    constructor() {
        this.table = null;
        this._pieces = [[null], [null], [null], [null], [null], [null], [null], [null], [null]];
        this._selected = null;
        this._moveHistory = {moves: [], turn: "white"};
    }

    /**
     *
     * @returns {{moves: [], turn: string}}
     */
    get moveHistory() {
        return this._moveHistory;
    }

    /**
     *
     * @param history
     */
    set moveHistory(history) {
        this._moveHistory = (typeof history !== "undefined") ? history : {moves: [], turn: "white"};
    }

    /**
     *
     */
    rebuildSetup() {
        this._moveHistory.moves.forEach(move => {
            const moved = this.movePiece(move.rowStart, move.columnStart, move.rowEnd, move.columnEnd);
            if(moved) this._changeTurn();
        });
    }

    /**
     *
     * @returns {null}
     */
    get selected() {
        return this._selected;
    }
    /**
     *
     * @param row
     * @param column
     * @returns {Element}
     * @private
     */
    // return $(".square[data-i=" + (row - 1) + ", data-j" + (column - 1) + "]").first();//[8 * (row - 1) + (column - 1)]); - change
    _getSquareByCoordinates(row, column) {
        return $($(this.table).children()[8 * (row - 1) + (column - 1)]);
    }

    /**
     *
     * @private
     */
    _putSquares() {
        if (this.table !== null) {
            for (let i = 1; i <= 8; ++i) {
                for (let j = 1; j <= 8; ++j) {
                    this.table.append($("<div/>").addClass("square").addClass(((i + j) % 2 === 0) ? "white-square" : "brown-square")
                            .attr("data-i", i)
                            .attr("data-j", j)
                            .css("grid-row", i + " / " + (i + 1))
                            .css("grid-column", j + " / " + (j + 1))
                            .click((event) => {
                                const index = $(event.currentTarget).index();
                                this._moveFlow(Math.floor(index / 8) + 1, index % 8 + 1);
                            }));

                    // $(window).on('click', (event) => {
                    //     if($(event.target).hasClass("square") || $(event.target).hasClass("piece")) {
                    //         let index = $(event.target).index();
                    //         if($(event.target).hasClass("piece"))
                    //             index = $(event.target).parent().index();
                    //
                    //         this._moveFlow(Math.floor(index / 8) + 1, index % 8 + 1);
                    //     }
                    // });

                    this._pieces[i].push(null);
                }
            }
        }
    }

    /**
     *
     * @param row
     * @param column
     * @param piece
     */
    addPiece(row, column, piece) {
        if (this._pieces[row][column] === null) {
            this._pieces[row][column] = piece;
            this._getSquareByCoordinates(row, column).append(piece.generatePieceDiv());
        }
    }

    /**
     *
     * @param rowStart
     * @param columnStart
     * @param rowEnd
     * @param columnEnd
     */
    movePiece(rowStart, columnStart, rowEnd, columnEnd) {
        const piece = this._pieces[rowStart][columnStart];
        const endPiece = this._pieces[rowEnd][columnEnd];

        const $squareDiv = this._getSquareByCoordinates(rowStart, columnStart);
        const $pieceDiv = $squareDiv.children()[0];
        const $endSquareDiv = this._getSquareByCoordinates(rowEnd, columnEnd);

        if (typeof piece !== "undefined" && piece !== null) {
            const moveSet = piece.getMoveContext().generateAlternatives(this._pieces, rowStart, columnStart);

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
            this._moveHistory.moves.push({rowStart: rowStart, columnStart: columnStart, rowEnd: rowEnd, columnEnd: columnEnd});
        }
    }

    /**
     *
     * @param element
     */
    generateTable(element) {
        this.table = $("<div/>").prependTo(element).addClass("chess-table");
        this._putSquares();

        $("<div id='turn'/>").prependTo(element).html("<p>" + this._moveHistory.turn + "'s turn</p>").addClass("turn");
    }

    /**
     *
     * @param row
     * @param column
     * @returns {boolean}
     * @private
     */
    _chooseMove(row, column) {
        if (this._selected) {
            if (this._selected.moveSet.find(move => move.row === row && move.column === column && !move.isKing)) {
                this.movePiece(this._selected.row, this._selected.column, row, column);
                return true;
            }
        }
        return false;
    }

    /**
     *
     * @private
     */
    _changeTurn() {
        this._moveHistory.turn = this._moveHistory.turn === "white" ? "black" : "white";
        $("#turn").html("<p>" + this._moveHistory.turn + "'s turn</p>");
    }

    /**
     *
     * @param row
     * @param column
     * @private
     */
    // see alternatives, choose move, see if in check
    _moveFlow(row, column) {
        const $currentSquare = this._getSquareByCoordinates(row, column);

        if ($currentSquare.children().length > 0 && !this._selected && this._pieces[row][column].color === this._moveHistory.turn) {
            this._highlightAlternatives(row, column, $currentSquare);
        }
        else {
            if(this._selected && (row !== this._selected.row || column !== this._selected.column)) {
                const moved = this._chooseMove(row, column);

                if(moved) {
                    this._changeTurn();
                    this._highlightCheck(row, column);
                }
            }

            if(this.selected) {
                this._cleanHighlight();
                this._selected = null;
            }
        }
    }

    /**
     *
     * @param row
     * @param column
     * @param currentSquare
     * @private
     */
    _highlightAlternatives(row, column, currentSquare) {
        this._cleanHighlight();
        $(currentSquare).addClass("select-piece");

        let moveSet = this._pieces[row][column].getMoveContext().generateAlternatives(this._pieces, row, column);

        moveSet.forEach(move => {
            if(!move.isKing)
                if (move.canCapture)
                    this._getSquareByCoordinates(move.row, move.column).addClass("can-capture");
                else
                    this._getSquareByCoordinates(move.row, move.column).addClass("move-alternative");
        });

        this._selected = {row: row, column: column, moveSet: moveSet};
    }

    /**
     *
     * @private
     */
    _highlightCheck() {
        let foundKing = false;

        for(let i = 1; i <= 8; ++i)
            for(let j = 1; j <= 8; ++j) {
                const piece = this._pieces[i][j];
                if(piece !== null) {
                    const moveSet = piece.getMoveContext().generateAlternatives(this._pieces, i, j);
                    moveSet.forEach(move => {
                        if (move.isKing) {
                            this._getSquareByCoordinates(move.row, move.column).addClass("check");
                            foundKing = true;
                        }
                    });
                }
            }

        if(!foundKing) {
            this.table.children().removeClass("check");
        }
    }

    /**
     *
     * @private
     */
    _cleanHighlight() {
        this.table.children().removeClass("select-piece");
        this.table.children().removeClass("move-alternative");
        this.table.children().removeClass("can-capture");
    }
}