export interface Player {
  symbol: 'X' | 'O' | undefined
  points: number
  active: boolean
  type: 'human' | 'robot'
}

export interface HumanPlayer extends Player {
  type: 'human'
}

export interface RobotPlayer extends Player {
  type: 'robot'
}

export interface GameStats {
  human: HumanPlayer
  robot: RobotPlayer
}


export const CANVAS_CENTER = { x: 540, y: 414 } as const;



const API = {
  "grid_state": [["l_00", "l_01", "l_02"], ["l_10", "l_11", "l_12"], ["l_20", "l_21", "l_22"]],
  "move": "letter : l in (i, j)",
  "game_is_finished": Bool,
  "winner": "None if not game_is_finished else l"
}


const responseBody = {
  grid_state: [
    ["l_00", "l_01", "l_02"], 
    ["l_10", "l_11", "l_12"], 
    ["l_20", "l_21", "l_22"]],
  
}

type GridItem = 'X' | 'O' | " "

type GridRow = [GridItem, GridItem, GridItem];

type Grid = [GridRow, GridRow, GridRow];

const lol = {
  "grid_state": [["0", "", " "], ["O", "X", " "], ["X", " ", " "]],
  "move": "letter : X in (2,0)",
  "game_is_finished": false,
  "winner": null
}


type ResponseBody = {
  grid_state: Grid,
  
}