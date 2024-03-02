//actual game

export const TILE_STATUSES = 
{
    HIDDEN : 'hidden',
    MINE : 'mine',
    MARKED : 'marked',
    NUMBER : 'number',
}

export function createBoard(boardSize, numberOfMines)
{
    //creating the board
    const board = []
    const minePositions = getMinePositions(boardSize, numberOfMines)
    console.log(minePositions)

    for (let x=0; x < boardSize; x++)
    {
        //create a new row for every x
        const row = []
        for (let y=0; y < boardSize; y++)
        {
            // for every row tiles
            const element = document.createElement("div")
            element.dataset.status = TILE_STATUSES.HIDDEN
            const tile = 
            {
                element,
                x,
                y,
                //if current tile is mine it should give true but it's not working
                mine: minePositions.some(positionMatch.bind(null, {x,y})),
                //type of tile
                get status()
                {
                    return this.element.dataset.status
                },
                set status(value)
                {
                    this.element.dataset.status = value
                }
            }
            row.push(tile)
        }
        board.push(row)
    }
    return board
}

//for marking as bomb
export function markTile(tile)
{
    if (tile.status !== TILE_STATUSES.HIDDEN && tile.status !== TILE_STATUSES.MARKED)
    {
        return
    }
    //if it is marked already
    if (tile.status === TILE_STATUSES.MARKED)
    {
        tile.status = TILE_STATUSES.HIDDEN
        tile.element.textContent = null
    } else
    {
        tile.status = TILE_STATUSES.MARKED
        tile.element.textContent = "⛳"
    }
}

//on left click
export function revealTile(board, tile)
{
    if (tile.status !== TILE_STATUSES.HIDDEN)
    {
        return 
    }
    if(tile.mine)
    {
        tile.status = TILE_STATUSES.MINE
        tile.element.textContent = "💣"
        return
    }
    tile.status = TILE_STATUSES.NUMBER
    const adjacentTiles = nearbyTiles(board, tile)
    const mines =adjacentTiles.filter(t => t.mine)
    if (mines.length === 0)
    {
        adjacentTiles.forEach(revealTile.bind(null,board))
    } else
    {
        tile.element.textContent = mines.length
    }
}

//for win
export function checkWin(board) 
{
    return board.every(row => 
        {
            return row.every(tile => 
            {
                return (
                    tile.status ===  TILE_STATUSES.NUMBER ||
                    (
                        tile.mine && 
                        (
                            tile.status === TILE_STATUSES.HIDDEN ||
                            tile.status === TILE_STATUSES.MARKED
                        )
                    )
                )       
            })
        })
}
//for lose
export function checkLose(board)
{
    return board.some(row =>
    {
        return row.some(tile => 
        {
            return tile.status === TILE_STATUSES.MINE
        })
    })
}

//putting mines
function getMinePositions(boardSize, numberOfMines)
{
    const positions = []
    //till mines are within range i want
    while(positions.length < numberOfMines)
    {
        const position = 
        {
            x: randomNumber(boardSize),
            y: randomNumber(boardSize)
        }
        //to check if this place even is empty (look for something else)
        if (!positions.some(positionMatch.bind(null, position)))
        {
            positions.push(position)
        }
    }
    return positions
}

function positionMatch(a, b)
{
    return a.x === b.x && a.y === b.y 
}

function nearbyTiles(board, {x,y})
{
    const tiles = []
    {
        for(let xOffset = -1; xOffset <= 1; xOffset++)
        {
            for(let yOffset = -1; yOffset <= 1; yOffset++)
            {
                const tile = board[x + xOffset]?.[y + yOffset]
                if(tile) tiles.push(tile)
            }
        }
    }

    return tiles
}

function randomNumber(size)
{
    return Math.floor(Math.random() * size)
}