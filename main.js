const table = new Table();
table.generateTable(document.body);

const pawn = new Pawn("black");
table.addPiece(5, 5, pawn);

const king = new Queen("white");
table.addPiece(4, 4, king);

// table.movePiece(5, 5, 4, 4);

// table.colorSquares([{row: 6, column: 2}, {row: 1, column: 5}]);