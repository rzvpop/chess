const startScreen = document.createElement("div");
startScreen.classList.add("start-screen");
startScreen.innerHTML = "5";

const table = new Table();

// document.body.appendChild(startScreen);
//
// let cnt = 4;
// const interval = setInterval(() => {
//     document.body.removeChild(startScreen);
//     startScreen.innerHTML = (cnt--).toString();
//     document.body.appendChild(startScreen);
//
//     if(cnt === -1)
//     {
//         table.generateTable(document.body);
//         clearInterval(interval);
//         document.body.removeChild(startScreen);
//     }
//
// }, 1000);

table.generateTable(document.body);

const knight = new Knight("black");
table.addPiece(8, 2, knight);

const queen = new Queen("white");
table.addPiece(8, 5, queen);

const pawn = new Pawn("white");
table.addPiece(5, 4, pawn);

const king = new King("black");
table.addPiece(6, 4, king);

// for(let i = 0; i < 8; ++i) {
//     const pawnB = new Pawn("black");
//     table.addPiece(7, i + 1, pawnB);
//
//     const pawnW = new Pawn("white");
//     table.addPiece(2, i + 1, pawnW);
// }
//
// const kingB = new King("black");
// table.addPiece(8, 4, kingB);
// const kingW = new King("white");
// table.addPiece(1, 4, kingW);
//
// const queenB = new Queen("black");
// table.addPiece(8, 5, queenB);
// const queenW = new Queen("white");
// table.addPiece(1, 5, queenW);
//
// const knightB1 = new Knight("black");
// table.addPiece(8, 2, knightB1);
// const knightB2 = new Knight("black");
// table.addPiece(8, 7, knightB2);
// const knightW1 = new Knight("white");
// table.addPiece(1, 2, knightW1)
// const knightW2 = new Knight("white");
// table.addPiece(1, 7, knightW2);
//
// const bishopB1 = new Bishop("black");
// table.addPiece(8, 3, bishopB1);
// const bishopB2 = new Bishop("black");
// table.addPiece(8, 6, bishopB2);
// const bishopW1 = new Bishop("white");
// table.addPiece(1, 3, bishopW1);
// const bishopW2 = new Bishop("white");
// table.addPiece(1, 6, bishopW2);
//
// const rookB1 = new Rook("black");
// table.addPiece(8, 1, rookB1)
// const rookB2 = new Rook("black");
// table.addPiece(8, 8, rookB2)
// const rookW1 = new Rook("white");
// table.addPiece(1, 1, rookW1)
// const rookW2 = new Rook("white");
// table.addPiece(1, 8, rookW2)