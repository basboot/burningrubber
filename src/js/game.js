import "../css/style.css";
import { Engine, DisplayMode } from "excalibur";
import { Resources, ResourceLoader } from "./resources.js";
import { Level } from "./level.js";

export class Game extends Engine {
  constructor() {
    super({
      width: 800,
      height: 450,
      maxFps: 60,
      displayMode: DisplayMode.FitScreen,
    });
    this.start(ResourceLoader).then(() => this.startGame());
  }

  startGame() {
    const level = new Level(); // Create the Level scene
    this.add("level", level); // Add the scene to the game
    this.goToScene("level"); // Switch to the Level scene
  }
}

new Game();
