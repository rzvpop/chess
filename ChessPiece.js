class ChessPiece {
    constructor(color) {
        if (this.constructor.name === "ChessPiece") {
            throw "Piece is abstract.";
        }
        this._color = color;
    }

    get color() {
        return this._color;
    }

    set color(value) {
        this._color = value;
    }

    generatePieceDiv() {
        return "";
    }
}

class Pawn extends ChessPiece {
    static _moveContext = PawnMoveContext;

    constructor(color) {
        super(color);
        this._first = false;
        this._enPassant = false;
    }

    getMoveContext() {
        return Pawn._moveContext;
    }

    get moveContext() {
        return ChessPiece._moveContext;
    }

    set moveContext(value) {
        ChessPiece._moveContext = value;
    }

    get first() {
        return this._first;
    }

    set first(value) {
        this._first = value;
    }

    generatePieceDiv() {
        const piece = document.createElement("div");
        piece.classList.add("piece");

        if(this.color === "white")
            piece.innerHTML = "&#x2659;";
        else
            piece.innerHTML = "&#x265F;";

        return piece;
    }
}

class King extends ChessPiece {
    constructor(color) {
        super(color);
        this.moveContext = {};
    }

    generatePieceDiv() {
        const piece = document.createElement("div");
        piece.classList.add("piece");

        if(this.color === "white")
            piece.innerHTML = "&#x2654;";
        else
            piece.innerHTML = "&#x265A;";

        return piece;
    }
}

class Queen extends ChessPiece {
    constructor(color) {
        super(color);
        this.moveContext = {};
    }

    generatePieceDiv() {
        const piece = document.createElement("div");
        piece.classList.add("piece");

        if(this.color === "white")
            piece.innerHTML = "&#x2655;";
        else
            piece.innerHTML = "&#x265B;";

        return piece;
    }
}

class Bishop extends ChessPiece {
    constructor(color) {
        super(color);
        this.moveContext = {};
    }

    generatePieceDiv() {
        const piece = document.createElement("div");
        piece.classList.add("piece");

        if(this.color === "white")
            piece.innerHTML = "&#x2657;";
        else
            piece.innerHTML = "&#x265D;";

        return piece;
    }
}

class Knight extends ChessPiece {
    constructor(color) {
        super(color);
        this.moveContext = {};
    }

    generatePieceDiv() {
        const piece = document.createElement("div");
        piece.classList.add("piece");

        if(this.color === "white")
            piece.innerHTML = "&#x2658;";
        else
            piece.innerHTML = "&#x265E;";

        return piece;
    }
}

class Rook extends ChessPiece {
    constructor(color) {
        super(color);
        this.moveContext = {};
    }

    generatePieceDiv() {
        const piece = document.createElement("div");
        piece.classList.add("piece");

        if(this.color === "white")
            piece.innerHTML = "&#x2656;";
        else
            piece.innerHTML = "&#x265C;";

        return piece;
    }
}