//display changes

import {
    TILE_STATUSES,
    createBoard,
    markTile,
    revealTile,
    checkWin,
    checkLose,
} from "./logic.js";

const BOARD_SIZE = 10;
const NUMBER_OF_MINES = 1;

const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
const boardElement = document.querySelector(".board");
const minesLeftText = document.querySelector("[minecount]");
const messageText = document.querySelector("[message]");

board.forEach((row) => {
    row.forEach((tile) => {
        boardElement.append(tile.element);
        tile.element.addEventListener("click", () => {
            revealTile(board, tile);
            checkGameEnd();
        });
        tile.element.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            markTile(tile);
            listMinesLeft();
        });
    });
});

boardElement.style.setProperty("--size", BOARD_SIZE);
minesLeftText.textContent = "💣Mines Left: " + NUMBER_OF_MINES;

function listMinesLeft() {
    const markedCount = board.reduce((count, row) => {
        return (
            count +
            row.filter((tile) => tile.status === TILE_STATUSES.MARKED).length
        );
    }, 0);

    minesLeftText.textContent =
        "💣Mines Left: " + (NUMBER_OF_MINES - markedCount);
}
function checkGameEnd() {
    const win = checkWin(board);
    const lose = checkLose(board);

    if (win || lose) {
        boardElement.addEventListener("click", stopProp, { capture: true });
        boardElement.addEventListener("contextmenu", stopProp, {
            capture: true,
        });
    }
    if (win) {
        messageText.textContent = "CONGRATULATIONS!🎊 YOU WON!";
        minesLeftText.textContent = null;
        board.forEach((row) => {
            row.forEach((tile) => {
                if (tile.status === TILE_STATUSES.HIDDEN) markTile(tile);
                if (tile.mine) revealTile(board, tile);
            });
        });
        // if(confirm('Congratulation!! You Won🎊 Press OK to restart'))
        // {
        //     window.location = '/Minesweeper.html'
        // }
        // return
    }
    if (lose) {
        messageText.textContent = "SORRY🙁 YOU LOST!";
        minesLeftText.textContent = null;
        //reveal all bomb
        board.forEach((row) => {
            row.forEach((tile) => {
                if (tile.status === TILE_STATUSES.MARKED) markTile(tile);
                if (tile.mine) revealTile(board, tile);
            });
        });
        //
        // {
        //     window.location = '/Minesweeper.html'
        // }
        // return
    }
}
function stopProp(e) {
    e.stopImmediatePropagation();
}
