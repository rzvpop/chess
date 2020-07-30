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
        this._firstDone = false;
        this._enPassant = false;
    }

    get enPassant() {
        return this._enPassant;
    }

    set enPassant(value) {
        this._enPassant = value;
    }

    getMoveContext() {
        return Pawn._moveContext;
    }

    get firstDone() {
        return this._firstDone;
    }

    set firstDone(value) {
        this._firstDone = value;
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
    static _moveContext = KingMoveContext;

    constructor(color) {
        super(color);
        this.moveContext = {};
    }

    getMoveContext() {
        return King._moveContext;
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
    static _moveContext = QueenMoveContext;

    constructor(color) {
        super(color);
    }

    getMoveContext() {
        return Queen._moveContext;
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
    static _moveContext = BishopMoveContext;

    constructor(color) {
        super(color);
        this.moveContext = {};
    }

    getMoveContext() {
        return Bishop._moveContext;
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
    static _moveContext = KnightMoveContext;

    constructor(color) {
        super(color);
        this.moveContext = {};
    }

    getMoveContext() {
        return Knight._moveContext;
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
    static _moveContext = RookMoveContext;

    constructor(color) {
        super(color);
        this.moveContext = {};
    }

    getMoveContext() {
        return Rook._moveContext;
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