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

const pawn = new Pawn("black");
table.addPiece(5, 5, pawn);

const king = new King("white");
table.addPiece(4, 4, king);

const queen = new Queen("black");
table.addPiece(4, 6, queen);