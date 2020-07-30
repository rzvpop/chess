class MoveContext {
    static unitMoves = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

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

        if(typeof piece !== "undefined" && piece !== null && piece.constructor.name === "Pawn")
        {
            const direction = piece.color === "white" ? 1 : -1;

            if(this._validPosition(row + direction, column) && table.pieces[row + direction][column] === null)
            {
                moveSet.push({row: row + direction, column: column});

                if(!piece.firstDone && MoveContext._validPosition(row + direction * 2, column) && table.pieces[row + direction * 2][column] === null)
                    moveSet.push({row: row + direction * 2, column: column});
            }

            const diagonalLeft = table.pieces[row + direction][column - 1];
            if(this._validPosition(row + direction, column - 1) && diagonalLeft !== null && diagonalLeft.color !== piece.color && diagonalLeft.constructor.name !== "King")
                moveSet.push({row: row + direction, column: column - 1, canCapture: true});

            const diagonalRight = table.pieces[row + direction][column + 1];
            if(this._validPosition(row + direction, column + 1) && diagonalRight !== null && diagonalRight.color !== piece.color &&
                diagonalRight.constructor.name !== "King")
                moveSet.push({row: row + direction, column: column + 1, canCapture: true});

            const left = table.pieces[row][column - 1];
            if(this._validPosition(row, column - 1) && left !== null && left.constructor.name === "Pawn" && left.color !== piece.color && left.enPassant)
                moveSet.push({row: row, column: column - 1, canCapture: true});

            const right = table.pieces[row][column + 1];
            if(this._validPosition(row, column + 1) && right !== null && right.constructor.name === "Pawn" && right.color !== piece.color && right.enPassant)
                moveSet.push({row: row, column: column + 1, canCapture: true});
        }

        return moveSet;
    }
}

// check if in check
class KingMoveContext extends MoveContext {
    static generateAlternatives(table, row, column) {
        const moveSet = [];
        const piece = table.pieces[row][column];

        if(typeof piece !== "undefined" && piece !== null && piece.constructor.name === "King")
        {
            MoveContext.unitMoves.forEach(move => {
                const inRangePiece = table.pieces[row + move[0]][column + move[1]];
                if(MoveContext._validPosition(row + move[0], column + move[1]))
                {
                    if(!inRangePiece) {
                        moveSet.push({row: row + move[0], column: column + move[1]});
                    }
                    else if(inRangePiece.color !== piece.color && inRangePiece.constructor.name !== "King") {
                        moveSet.push({row: row + move[0], column: column + move[1], canCapture: true});
                    }
                }
            });
        }

        return moveSet;
    }
}

class QueenMoveContext extends MoveContext {
    static generateAlternatives(table, row, column) {
        const moveSet = [];
        const piece = table.pieces[row][column];

        MoveContext.unitMoves.forEach(move => {

            let cnt = 1;
            while(MoveContext._validPosition(row + cnt * move[0], column + cnt * move[1]) &&
            table.pieces[row + cnt * move[0]][column + cnt * move[1]] === null)
            {
                moveSet.push({row: row + cnt * move[0], column: column + cnt * move[1]});
                ++cnt;
            }

            if(MoveContext._validPosition(row + cnt * move[0], column + cnt * move[1]) &&
                table.pieces[row + cnt * move[0]][column + cnt * move[1]].color !== piece.color &&
                table.pieces[row + cnt * move[0]][column + cnt * move[1]].constructor.name !== "King")
            {
                moveSet.push({row: row + cnt * move[0], column: column + cnt * move[1], canCapture: true});
            }
        });

        return moveSet;
    }
}

class BishopMoveContext extends MoveContext {

}

class KnightMoveContext extends MoveContext {

}

class RookMoveContext extends MoveContext {

}