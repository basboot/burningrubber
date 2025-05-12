import "../css/style.css";
import { Engine, DisplayMode, SolverStrategy, Timer } from "excalibur";
import { Resources, ResourceLoader } from "./resources.js";
import {GameState, GameStateEvent} from "./events/gamestateevent.js";
import {GameSound, GameSoundEvent} from "./events/gamesoundevent.js";
import {Level} from "./level/level.js";

export class Game extends Engine {
  isEffectOn = false;
  gameState = GameState.INIT;

  constructor() {
    super({
      width: 800,
      height: 500,
      maxFps: 60,
      displayMode: DisplayMode.FitScreen,
      physics: {
        solver: SolverStrategy.Realistic, // Use the Arcade solver (default)
      },
    });

    this.start(ResourceLoader).then(() => this.startGame());

    // this.toggleDebug();
  }

  onInitialize(engine) {
    engine.events.on("gameStateChange", (event) => {
      this.gameState = event.gameState;
    });
  }

  async startGame() {
    const level = new Level(); // Create the Level scene
    this.add("level", level); // Add the scene to the game
    await this.goToScene("level"); // Switch to the Level scene
  }

  toggleEffect() {
    this.isEffectOn = !this.isEffectOn;

    console.log("effect on", this.isEffectOn);
    this.events.emit(
      "gameSoundChange",
      new GameSoundEvent(this.isEffectOn ? GameSound.EFFECT_ON : GameSound.EFFECT_OFF)
    );
  }

  setGameState(gameState, levelCompleted = false) {
    console.log("GAMESTATECHANGE: ", gameState, levelCompleted);
    this.events.emit("gameStateChange", new GameStateEvent(gameState, levelCompleted));
  }
}

new Game();
