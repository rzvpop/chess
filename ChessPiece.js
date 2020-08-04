// refactor: add coordinates

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
        return $("<div/>").addClass("piece").html(this.color === "white" ? "&#x2659;" : "&#x265F;");
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
        return $("<div/>").addClass("piece").html(this.color === "white" ? "&#x2654;" : "&#x265A;");
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
        return $("<div/>").addClass("piece").html(this.color === "white" ? "&#x2655;" : "&#x265B;");
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
        return $("<div/>").addClass("piece").html(this.color === "white" ? "&#x2657;" : "&#x265D;");
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
        return $("<div/>").addClass("piece").html(this.color === "white" ? "&#x2658;" : "&#x265E;");
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
        return $("<div/>").addClass("piece").html(this.color === "white" ? "&#x2656;" : "&#x265C;");
    }
}