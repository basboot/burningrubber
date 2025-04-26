import "../css/style.css";
import {Engine, DisplayMode, SolverStrategy, Timer} from "excalibur";
import { Resources, ResourceLoader } from "./resources.js";
import { Level } from "./level.js";
import { MusicPlayer } from "./musicPlayer.js";

export class Game extends Engine {
  constructor() {
    super({
      width: 800,
      height: 450,
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

  async startGame() {
    // Load the MIDI data
    const response = await fetch("/public/music/autobahn2.json");
    const midiData = await response.json();

    // Initialize and play the music
    const musicPlayer = new MusicPlayer(midiData);
    musicPlayer.setVolume(this.soundLevel); // Set the initial sound level
    if (true) {
      // TODO: create better sounds
      musicPlayer.play();
    }

    const level = new Level(); // Create the Level scene
    this.add("level", level); // Add the scene to the game
    await this.goToScene("level"); // Switch to the Level scene

  }
}

new Game();
