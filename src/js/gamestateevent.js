import { GameEvent } from "excalibur";

export const GameState = Object.freeze({
  INIT: "INIT",
  MENU: "MENU",
  PLAYING: "PLAYING",
  GAMEOVER: "GAMEOVER",
});

export class GameStateEvent extends GameEvent {
  constructor(gameState, levelCompleted = false) {
    super();
    this.gameState = gameState;
    this.levelCompleted = levelCompleted;
  }
}
