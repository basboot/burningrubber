import "../css/style.css";
import { Engine, DisplayMode, SolverStrategy } from "excalibur";
import { Resources, ResourceLoader } from "./resources.js";
import { Level } from "./level.js";
import {MusicPlayer} from "./musicPlayer.js";

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
    this.start(ResourceLoader).then(() => this.startGame());
  }

  async startGame() {
    // Load the MIDI data
    const response = await fetch("/public/music/autobahn.json");
    const midiData = await response.json();

    // Initialize and play the music
    const musicPlayer = new MusicPlayer(midiData);
    musicPlayer.play();

    const level = new Level(); // Create the Level scene
    this.add("level", level); // Add the scene to the game
    this.goToScene("level"); // Switch to the Level scene

  }
}

new Game();
