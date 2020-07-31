class MoveContext {
    static unitMoves = [];

    static _validPosition(row, column) {
        return row >= 1 && row <= 8 && column >= 1 && column <= 8;
    }

    static generateAlternatives() {
        return [];
    }
}

// king not to remain in check

class PawnMoveContext extends MoveContext {
    // en passant
    static generateAlternatives(table, row, column) {
        const moveSet = [];
        const piece = table.pieces[row][column];

        const direction = piece.color === "white" ? 1 : -1;

        if(this._validPosition(row + direction, column) && table.pieces[row + direction][column] === null)
        {
            moveSet.push({row: row + direction, column: column});

            if(!piece.firstDone && MoveContext._validPosition(row + direction * 2, column) && table.pieces[row + direction * 2][column] === null)
                moveSet.push({row: row + direction * 2, column: column});
        }

        if(this._validPosition(row + direction, column - 1)) {
            const diagonalLeft = table.pieces[row + direction][column - 1];
            if (diagonalLeft !== null) {
                if (diagonalLeft.color !== piece.color)
                    moveSet.push({row: row + direction, column: column - 1, canCapture: true, isKing: diagonalLeft.constructor.name === "King"});
            }
        }

        if(this._validPosition(row + direction, column + 1)) {
            const diagonalRight = table.pieces[row + direction][column + 1];
            if (diagonalRight !== null && diagonalRight.color !== piece.color)
                moveSet.push({row: row + direction, column: column + 1, canCapture: true, isKing: diagonalRight.constructor.name === "King"
                });
        }

        if(this._validPosition(row, column - 1)) {
            const left = table.pieces[row][column - 1];
            if(left !== null && left.constructor.name === "Pawn" && left.color !== piece.color && left.enPassant)
                moveSet.push({row: row, column: column - 1, canCapture: true});
        }

        if(this._validPosition(row, column + 1)) {
            const right = table.pieces[row][column + 1];
            if(right !== null && right.constructor.name === "Pawn" && right.color !== piece.color && right.enPassant)
                moveSet.push({row: row, column: column + 1, canCapture: true});
        }

        return moveSet;
    }
}

// check if in check
class KingMoveContext extends MoveContext {
    static unitMoves = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

    static generateAlternatives(table, row, column) {
        const moveSet = [];
        const piece = table.pieces[row][column];

        KingMoveContext.unitMoves.forEach(move => {
            if(MoveContext._validPosition(row + move[0], column + move[1])) {
                const inRangePiece = table.pieces[row + move[0]][column + move[1]];
                if(!inRangePiece) {
                    moveSet.push({row: row + move[0], column: column + move[1]});
                }
                else if(inRangePiece.color !== piece.color) {
                    moveSet.push({row: row + move[0], column: column + move[1], canCapture: true, isKing: inRangePiece.constructor.name === "King"});
                }
            }
        });

        return moveSet;
    }
}

class QueenBishopRookMoveContext extends MoveContext {
    static generateAlternatives(table, row, column, unitMoves) {
        const moveSet = [];
        const piece = table.pieces[row][column];

        unitMoves.forEach(move => {
            let cnt = 1;
            while(MoveContext._validPosition(row + cnt * move[0], column + cnt * move[1]) &&
                    table.pieces[row + cnt * move[0]][column + cnt * move[1]] === null) {

                moveSet.push({row: row + cnt * move[0], column: column + cnt * move[1]});
                ++cnt;
            }

            if(MoveContext._validPosition(row + cnt * move[0], column + cnt * move[1]) &&
                table.pieces[row + cnt * move[0]][column + cnt * move[1]].color !== piece.color)
            {
                moveSet.push({row: row + cnt * move[0], column: column + cnt * move[1], canCapture: true,
                    isKing: table.pieces[row + cnt * move[0]][column + cnt * move[1]].constructor.name === "King"});
            }
        });

        return moveSet;
    }
}

class QueenMoveContext extends MoveContext {
    static unitMoves = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

    static generateAlternatives(table, row, column) {
        return QueenBishopRookMoveContext.generateAlternatives(table, row, column, QueenMoveContext.unitMoves);
    }
}

class BishopMoveContext extends MoveContext {
    static unitMoves = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

    static generateAlternatives(table, row, column) {
        return QueenBishopRookMoveContext.generateAlternatives(table, row, column, BishopMoveContext.unitMoves);
    }
}

class KnightMoveContext extends MoveContext {
    static unitMoves = [[-1, -2], [-1, 2], [1, -2], [1, 2], [-2, -1], [-2, 1], [2, -1], [2, 1]];

    static generateAlternatives(table, row, column) {
        const moveSet = [];
        const piece = table.pieces[row][column];

        KnightMoveContext.unitMoves.forEach(move => {
            if(MoveContext._validPosition(row + move[0], column + move[1])) {
                const inRangePiece = table.pieces[row + move[0]][column + move[1]];
                if(!inRangePiece) {
                    moveSet.push({row: row + move[0], column: column + move[1]});
                }
                else if(inRangePiece.color !== piece.color) {
                    moveSet.push({row: row + move[0], column: column + move[1], canCapture: true, isKing: inRangePiece.constructor.name === "King"});
                }
            }
        });

        return moveSet;
    }

}

class RookMoveContext extends MoveContext {
    static unitMoves = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

    static generateAlternatives(table, row, column) {
        return QueenBishopRookMoveContext.generateAlternatives(table, row, column, RookMoveContext.unitMoves);
    }
}