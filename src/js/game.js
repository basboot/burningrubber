import "../css/style.css";
import { Engine, DisplayMode, SolverStrategy, Timer } from "excalibur";
import { Resources, ResourceLoader } from "./resources.js";
import { Level } from "./level.js";
import { MusicPlayer } from "./musicPlayer.js";
import { GameSound, GameSoundEvent } from "./gamesoundevent.js";
import { GameState, GameStateEvent } from "./gamestateevent.js";

export class Game extends Engine {
  isEffectOn = false;
  isMusicOn = false;
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

    this.soundLevel = 0.5; // Default sound level (50%)
    this.start(ResourceLoader).then(() => this.startGame());

    // this.toggleDebug();
  }

  onInitialize(engine) {
    engine.events.on("gameStateChange", (event) => {
      this.gameState = event.gameState;
    });
  }

  async startGame() {
    // Load the MIDI data
    const response = await fetch("/music/popcorn1.json");
    const midiData = await response.json();

    // Initialize and play the music
    const musicPlayer = new MusicPlayer(midiData);
    musicPlayer.setVolume(this.soundLevel); // Set the initial sound level
    if (false) {
      // TODO: create better sounds
      musicPlayer.play();
    }

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
