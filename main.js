$(document).ready(function(){
    const body = $("body");
    const menu = $("<div id='menu'>").prependTo(body).addClass("menu");

    const local = $("<div id='local'/>").prependTo(body).html("<button>Local game</button>").addClass("game-mode")
        .on("click", () => {
            local.remove();
            online.remove();

            setupGame(0, body, menu)
        });

    const online = $("<div id='online'/>").prependTo(body).html("<button>Online game</button>").addClass("game-mode")
        .on("click", () => {
            local.remove();
            online.remove();

            const onlineGame = $("<div id='online-game'/>").prependTo(body);
            const gameList = $("<div id='room-choose'/>").prependTo(onlineGame).html("<p>Choose game</p>").addClass("room-choose").
                on("click", event => {
                    const listItem = $(event.target).is("li") ? $(event.target) : null;
                    if (listItem) {
                        onlineGame.remove();

                        setupGame(1, body, menu, Number.parseInt(listItem.attr("id")));
                    }
                });
            getAllGames(gameList);

            const roomCreate = $("<div id='room-create'/>").prependTo(onlineGame).html("<input type='text' placeholder='Choose a name'> <button>Create online game</button>").addClass("room-create")
                .on("click", event => {
                    const element = $(event.target).is("button") ? $(event.target) : null;
                    if (element) {
                        createGame(gameList, element.parent().children("input").val());
                    }
                });
        });
});

const setupGame = (gameMode, body, menu, gameId) => {
    let $startScreen = $("<div/>").prependTo(body).addClass("start-screen").html("<p>5</p>");
    let cnt = 4;
    const interval = setInterval(() => {

       $startScreen.remove();
       $startScreen = $("<div/>").prependTo(body).addClass("start-screen").html("<p>" + (cnt--) + "</p>");

        if(cnt === -1) {
            clearInterval(interval);
            $startScreen.remove();

            let table = new Table(gameMode, gameId);
            setupTable(table, body, menu, gameMode);

            if(gameMode === 0) {
                $(window).on("unload", () => {
                    localStorage.moveHistory = JSON.stringify(table.moveHistory);
                });

                if(localStorage.moveHistory) {
                    table.moveHistory = JSON.parse(localStorage.moveHistory);
                    table.rebuildSetup();
                }

                $("<div id='undo'/>").prependTo(menu).html("<button>Undo</button>").addClass("undo");
                $("<div id='reset'/>").prependTo(menu).html("<button>Reset</button>").addClass("reset");
                body.on("click", (event) => {
                    const element = $(event.target).is("button") ? $(event.target) : null;
                    if (element) {
                        if (element.parent().attr("id") === "reset") {
                            table.table.remove();
                            table = null;

                            let newTable = new Table(gameMode);
                            newTable.moveHistory = {moves: {created: []}, turn: "white"};
                            setupTable(newTable, element, menu);
                        } else if (element.parent().attr("id") === "undo") {

                        }
                    }
                });
            }
            else {
                getGame(gameId, table);

                const interval = setInterval(() => {
                    updateGame(gameId, table);
                }, 1000);
            }
        }

    }, 300);
}

const getAllGames = gameList => {
    $.ajax({
        method: "GET",
        url: "https://chess.thrive-dev.bitstoneint.com/wp-json/chess-api/game",
    }).done(res => {
        const list = $("<ul/>");
        res.forEach(game => {
            list.append($("<li>" + game.ID + ": " + game.post_title + "</li>").attr("id", game.ID.toString()));
        });
        $(gameList).append(list);
    });
};

const sendMoveToServer = (move, id) => {
    $.ajax({
        method: "PUT",
        url: "https://chess.thrive-dev.bitstoneint.com/wp-json/chess-api/game/" + id.toString(),
        data: {move: {from: {x: move.rowStart - 1, y: move.columnStart - 1}, to: {x: move.rowEnd - 1, y: move.columnEnd - 1}}}
    }).done(res => {
        console.log("sendMoveToServer: " + res);
    });
}

const updateGame = (id, table) => {
    if(Number.isInteger(id)) {
        $.ajax({
            method: "GET",
            url: "https://chess.thrive-dev.bitstoneint.com/wp-json/chess-api/game/" + id.toString(),
        }).done(res => {
            const onlineGames = localStorage.onlineGames ? JSON.parse(localStorage.onlineGames) : {created: []};
            if(onlineGames.created.includes(id))
                table.canMove = res.moves.length % 2 === 0;
            else
                table.canMove = res.moves.length % 2 !== 0;

            const lastMove = res.moves[res.moves.length - 1];
            if (typeof lastMove === "object" && lastMove !== null && lastMove.hasOwnProperty("from") && lastMove.hasOwnProperty("to")) {
                table.movePiece(Number.parseInt(lastMove.from.x) + 1, Number.parseInt(lastMove.from.y) + 1,
                    Number.parseInt(lastMove.to.x) + 1, Number.parseInt(lastMove.to.y) + 1);
            }
        });
    }
};

const getGame = (id, table) => {
    if(Number.isInteger(id)) {
        $.ajax({
            method: "GET",
            url: "https://chess.thrive-dev.bitstoneint.com/wp-json/chess-api/game/" + id.toString(),
        }).done(res => {
            const onlineGames = localStorage.onlineGames ? JSON.parse(localStorage.onlineGames) : {created: []};
            if(onlineGames.created.includes(id))
                table._canMove = res.moves.length % 2 === 0;
            else
                table._canMove = res.moves.length % 2 !== 0;

            res.moves = res.moves === "" ? [] : res.moves;
            res.moves.forEach(move => {
                if(typeof move === "object" && move !== null && move.hasOwnProperty("from") && move.hasOwnProperty("to")) {
                    table.movePiece(Number.parseInt(move.from.x) + 1, Number.parseInt(move.from.y) + 1,
                                    Number.parseInt(move.to.x) + 1, Number.parseInt(move.to.y) + 1);
                }
            });
        });
    }
};

const createGame = (gameList, name) => {
    $.ajax({
        method: "POST",
        url: "https://chess.thrive-dev.bitstoneint.com/wp-json/chess-api/game",
        data: {name: name}
    }).done(res => {
        if(!localStorage.onlineGames) {
            localStorage.onlineGames = JSON.stringify({created: [res.ID]});
        }
        else {
            const onlineGames = JSON.parse(localStorage.onlineGames);
            onlineGames.created.push(res.ID);
            localStorage.onlineGames = JSON.stringify(onlineGames);
        }

        getAllGames(gameList);
    }).fail(err => {
        console.log("Create game: " + err);
    });
}

const setupTable = (table, element, menu) => {
    table.generateTable(element, menu, sendMoveToServer);

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
};
