class MoveContext {}

// king not to remain in check

class PawnMoveContext extends MoveContext {
    // en passant
    static generateAlternatives(table, row, column) {
        const moveSet = [];
        const piece = table.pieces[row][column];

        if(typeof piece !== "undefined" && piece !== null && piece.constructor.name === "Pawn")
        {
            const direction = piece.color === "white" ? 1 : -1;
            if(piece.first === false)
            {
                for(let i = 1; i <= 2; ++i)
                {
                    if(this._validPosition(row + direction * i, column) && table.pieces[row + direction * i][column] === null)
                        moveSet.push({row: row + direction * i, column: column});
                }
            }
            else
            {
                if(this._validPosition(row + direction, column) && table.pieces[row + direction][column] === null)
                    moveSet.push({row: row + direction, column: column});
            }

            if(table.pieces[row + direction][column - 1] !== null && table.pieces[row + direction][column - 1].color !== piece.color &&
                table.pieces[row + direction][column - 1].constructor.name !== "King")
                moveSet.push({row: row + direction, column: column - 1});

            if(table.pieces[row + direction][column + 1] !== null && table.pieces[row + direction][column + 1].color !== piece.color &&
                table.pieces[row + direction][column + 1].constructor.name !== "King")
                moveSet.push({row: row + direction, column: column + 1});
        }

        return moveSet;
    }

    static _validPosition(row, column) {
        return row >= 1 && row <= 8 && column >= 1 && column <= 8;
    }
}

