$(document).ready(function(){
    const body = $("body");
    // const $startScreen = $("<div/>").prependTo($("body")).addClass("start-screen").html("5");
    // let cnt = 4;
    // const interval = setInterval(() => {
    //
    //     $startScreen.removeClass("start-screen").addClass("start-screen").html((cnt--).toString());
    //
    //     if(cnt === -1)
    //     {
    //         clearInterval(interval);
            let table = setupTable(body);
    //     }
    //
    // }, 1000);

    $(window).on("unload", () => {
        localStorage.moveHistory = JSON.stringify(table.moveHistory);
    });

    if(localStorage.moveHistory) {
        table.moveHistory = JSON.parse(localStorage.moveHistory);
        table.rebuildSetup();
    }

    $("<div id='undo'/>").prependTo(body).html("<button>Undo</button>").addClass("undo");
    $("<div id='reset'/>").prependTo(body).html("<button>Reset</button>").addClass("reset");
    body.on('click', (event) => {
        const element = $(event.target).is("button") ? $(event.target) : null;
        if(element) {
            if (element.parent().attr("id") === "reset") {
                table.moveHistory = {moves: [], turn: "white"};
                table = setupTable(body);
            }
            else if (element.parent().attr("id") === "undo") {

            }
        }
    });
});

const setupTable = (element) => {
    const table = new Table();
    table.generateTable(element);

    for(let i = 0; i < 8; ++i) {
        const pawnB = new Pawn("black");
        table.addPiece(7, i + 1, pawnB);

        const pawnW = new Pawn("white");
        table.addPiece(2, i + 1, pawnW);
    }

    const kingB = new King("black");
    table.addPiece(8, 4, kingB);
    const kingW = new King("white");
    table.addPiece(1, 4, kingW);

    const queenB = new Queen("black");
    table.addPiece(8, 5, queenB);
    const queenW = new Queen("white");
    table.addPiece(1, 5, queenW);

    const knightB1 = new Knight("black");
    table.addPiece(8, 2, knightB1);
    const knightB2 = new Knight("black");
    table.addPiece(8, 7, knightB2);
    const knightW1 = new Knight("white");
    table.addPiece(1, 2, knightW1)
    const knightW2 = new Knight("white");
    table.addPiece(1, 7, knightW2);

    const bishopB1 = new Bishop("black");
    table.addPiece(8, 3, bishopB1);
    const bishopB2 = new Bishop("black");
    table.addPiece(8, 6, bishopB2);
    const bishopW1 = new Bishop("white");
    table.addPiece(1, 3, bishopW1);
    const bishopW2 = new Bishop("white");
    table.addPiece(1, 6, bishopW2);

    const rookB1 = new Rook("black");
    table.addPiece(8, 1, rookB1)
    const rookB2 = new Rook("black");
    table.addPiece(8, 8, rookB2)
    const rookW1 = new Rook("white");
    table.addPiece(1, 1, rookW1)
    const rookW2 = new Rook("white");
    table.addPiece(1, 8, rookW2);

    return table;
};