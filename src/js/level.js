import { Scene, Vector, Color, Axis, Keys } from "excalibur";
import { Car } from "./car.js";
import { RoadBar } from "./roadbar.js";
import { Player } from "./player.js";
import { EnemyCar } from "./enemycar.js";
import { Obstacle } from "./obstacle.js";
import { EnemyCreator } from "./enemycreator.js";
import { Explosion } from "./explosion.js";
import { Speedometer } from "./speedometer.js";
import { Score } from "./score.js";
import { GameState } from "./game.js";
import { GameOver } from "./gameover.js";

export class Level extends Scene {
  gameState = GameState.IDLE;

  constructor() {
    super(); // Call the superclass constructor
    this.lanes = []; // Initialize lanes as an empty array
  }

  async onInitialize(engine) {
    this.gameState = GameState.PLAYING;
    // Set the background color to grey
    this.backgroundColor = Color.Gray;

    this.tileWidth = 100; // Width of each tile
    this.tileHeight = 100; // Height of each tile

    // Create a car in the middle of the screen, moving upward
    const car = new Player("camaro", new Vector(400, 0), new Vector(0, -200), 200, 400);
    this.player = car;

    this.add(car);

    this.speedometer = new Speedometer(car);
    this.add(this.speedometer);

    this.score = new Score(car);
    this.add(this.score);

    // Add road bars to the middle of the screen
    const barSpacing = 100; // Space between bars
    const barCount = Math.ceil(engine.drawHeight / barSpacing); // Number of bars to fill the screen
    for (let i = 0; i < barCount; i++) {
      const barY = i * barSpacing; // Calculate y position for each bar

      // fill screen with bars
      for (let i = 0; i < 9; i++) {
        const bar = new RoadBar(new Vector(i * 100, barY));
        this.add(bar);
      }
    }

    // Lock the camera to follow the car in the y-direction only, bit behind
    this.camera.update = (engine, elapsed) => {
      // Add the offset to the normal camera position
      const actorPosition = new Vector(400, this.player.pos.y - 100);
      this.camera.pos = actorPosition;
    };

    // Load the level configuration from a text file
    const layout = await this.loadLevelLayout("config/level1.txt");
    this.generateLevel(layout);

    this.add(new EnemyCreator());

    engine.input.keyboard.on("press", (e) => {
      if (e.key === Keys.S) {
        console.log("S key was pressed!");
        engine.toggleEffect();
      }
    });
  }

  async loadLevelLayout(filePath) {
    // Fetch the level configuration from the text file
    const response = await fetch(filePath);
    const text = await response.text();
    return text.trim().split("\n"); // Split the layout into lines
  }

  generateLevel(layout) {
    layout.forEach((line, rowIndex) => {
      const lanes = [];
      const tiles = line.split(""); // Split the line into individual characters

      tiles.forEach((tile, colIndex) => {
        const x = colIndex * this.tileWidth; // Calculate the x position of the tile
        const y = -rowIndex * this.tileHeight; // Calculate the y position of the tile

        if (tile === "G") {
          // Add grass
          const grass = new Obstacle(x, y, this.tileWidth, this.tileHeight);
          this.add(grass);
        } else if (tile === "R") {
          lanes.push(x + this.tileWidth / 2);
        }
      });
      this.lanes.push(lanes);
    });
  }

  getLanes(offset = 0) {
    const tileIndex = Math.floor(-this.player.pos.y / this.tileHeight);

    return this.lanes[tileIndex];
  }

  addExplosion(pos, value) {
    const explosion = new Explosion(value);
    explosion.pos = pos;
    this.add(explosion);
    // TODO: create methods
    this.score.multiplierValue += value;
  }

  onPreUpdate(engine, delta) {
    if (this.gameState === GameState.PLAYING && this.player.gameOver === true) {
      // TODO: check game over logic
      this.gameState = GameState.GAME_OVER;
      this.add(new GameOver());
    }
  }
}
