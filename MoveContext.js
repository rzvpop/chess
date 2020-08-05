class MoveContext {
    static unitMoves = [];

    static _validPosition(row, column) {
        return row >= 1 && row <= 8 && column >= 1 && column <= 8;
    }

    static generateAlternatives() {
        return [];
    }
}

//TODO: en passant
class PawnMoveContext extends MoveContext {
    static generateAlternatives(pieces, row, column) {
        const moveSet = [];
        const piece = pieces[row][column];

        const direction = piece.color === "white" ? 1 : -1;

        if(this._validPosition(row + direction, column) && pieces[row + direction][column] === null)
        {
            moveSet.push({row: row + direction, column: column, noThreaten: true});

            if(!piece.firstDone && MoveContext._validPosition(row + direction * 2, column) && pieces[row + direction * 2][column] === null)
                moveSet.push({row: row + direction * 2, column: column, noThreaten: true});
        }

        if(this._validPosition(row + direction, column - 1)) {
            const diagonalLeft = pieces[row + direction][column - 1];
            if (diagonalLeft !== null) {
                if (diagonalLeft.color !== piece.color)
                    moveSet.push({row: row + direction, column: column - 1, canCapture: true, isKing: diagonalLeft.constructor.name === "King"});
            }
        }

        if(this._validPosition(row + direction, column + 1)) {
            const diagonalRight = pieces[row + direction][column + 1];
            if (diagonalRight !== null && diagonalRight.color !== piece.color)
                moveSet.push({row: row + direction, column: column + 1, canCapture: true, isKing: diagonalRight.constructor.name === "King"});
        }

        if(this._validPosition(row, column - 1)) {
            const left = pieces[row][column - 1];
            if(left !== null && left.constructor.name === "Pawn" && left.color !== piece.color && left.enPassant)
                moveSet.push({row: row, column: column - 1, canCapture: true});
        }

        if(this._validPosition(row, column + 1)) {
            const right = pieces[row][column + 1];
            if(right !== null && right.constructor.name === "Pawn" && right.color !== piece.color && right.enPassant)
                moveSet.push({row: row, column: column + 1, canCapture: true});
        }

        return moveSet;
    }
}

//TODO: -king not to remain in check
//      -refactor check checking
//      -king can go in pwan check :-?
/***
 * 'isKing' property applies only when there is an opponent king; it overrides 'canCapture'
 */
class KingMoveContext extends MoveContext {
    static unitMoves = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

    static generateAlternatives(pieces, row, column) {
        let moveSet = [];
        const moveSetWithCheck = [];
        const piece = pieces[row][column];

        if(piece.constructor.name === "King") {
            KingMoveContext.unitMoves.forEach(move => {
                if (MoveContext._validPosition(row + move[0], column + move[1])) {
                    const inRangePiece = pieces[row + move[0]][column + move[1]];
                    if (!inRangePiece) {
                        moveSetWithCheck.push({row: row + move[0], column: column + move[1]});
                    } else if (inRangePiece.color !== piece.color) {
                        moveSetWithCheck.push({
                            row: row + move[0],
                            column: column + move[1],
                            canCapture: true,
                            isKing: inRangePiece.constructor.name === "King"
                        });
                    }
                }
            });

            pieces[row][column] = null;
            let threatenedPositions = [];
            try {
                for (let i = 1; i <= 8; ++i)
                    for (let j = 1; j <= 8; ++j) {
                        const opponentPiece = pieces[i][j];
                        if (opponentPiece !== null && opponentPiece.color !== piece.color /* && opponentPiece.constructor.name !== "King" */) {
                            threatenedPositions = [...threatenedPositions, ...opponentPiece.getMoveContext().generateAlternatives(pieces, i, j).filter(move => !move.noThreaten)];

                        }
                    }
            }
            catch (e) {
                console.log(e);
            }
            pieces[row][column] = piece;

            moveSetWithCheck.forEach(move => {
                if(!threatenedPositions.find(threatenedPosition => threatenedPosition.row === move.row && threatenedPosition.column === move.column))
                    moveSet.push(move);
            });
        }
        return moveSet;
    }
}

class QueenBishopRookMoveContext extends MoveContext {
    static generateAlternatives(pieces, row, column, unitMoves) {
        const moveSet = [];
        const piece = pieces[row][column];

        unitMoves.forEach(move => {
            let cnt = 1;
            while(MoveContext._validPosition(row + cnt * move[0], column + cnt * move[1]) &&
                    pieces[row + cnt * move[0]][column + cnt * move[1]] === null) {

                moveSet.push({row: row + cnt * move[0], column: column + cnt * move[1]});
                ++cnt;
            }

            if(MoveContext._validPosition(row + cnt * move[0], column + cnt * move[1]) &&
                pieces[row + cnt * move[0]][column + cnt * move[1]].color !== piece.color)
            {
                moveSet.push({row: row + cnt * move[0], column: column + cnt * move[1], canCapture: true,
                    isKing: pieces[row + cnt * move[0]][column + cnt * move[1]].constructor.name === "King"});
            }
        });

        return moveSet;
    }
}

class QueenMoveContext extends MoveContext {
    static unitMoves = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

    static generateAlternatives(pieces, row, column) {
        return QueenBishopRookMoveContext.generateAlternatives(pieces, row, column, QueenMoveContext.unitMoves);
    }
}

class BishopMoveContext extends MoveContext {
    static unitMoves = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

    static generateAlternatives(pieces, row, column) {
        return QueenBishopRookMoveContext.generateAlternatives(pieces, row, column, BishopMoveContext.unitMoves);
    }
}

class KnightMoveContext extends MoveContext {
    static unitMoves = [[-1, -2], [-1, 2], [1, -2], [1, 2], [-2, -1], [-2, 1], [2, -1], [2, 1]];

    static generateAlternatives(pieces, row, column) {
        const moveSet = [];
        const piece = pieces[row][column];

        KnightMoveContext.unitMoves.forEach(move => {
            if(MoveContext._validPosition(row + move[0], column + move[1])) {
                const inRangePiece = pieces[row + move[0]][column + move[1]];
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
    static unitMoves = [[-1, 0], [0, -1], [0, 1], [1, 0]];

    static generateAlternatives(pieces, row, column) {
        return QueenBishopRookMoveContext.generateAlternatives(pieces, row, column, RookMoveContext.unitMoves);
    }
}