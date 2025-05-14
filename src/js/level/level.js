import { Color, Keys, Scene, Vector } from "excalibur";
import { Player } from "../player/player.js";
import { Speedometer } from "../ui/speedometer.js";
import { Score } from "../ui/score.js";
import { SoundConfig } from "../ui/soundconfig.js";
import { RoadBar } from "../gameelements/road/roadbar.js";
import { GameState } from "../events/gamestateevent.js";
import { Explosion } from "../effects/explosion.js";
import { GameOver } from "../ui/gameover.js";
import { Obstacle } from "../gameelements/road/obstacle.js";
import { createEnemyCar } from "../enemy/enemycreator.js";

export class Level extends Scene {
  isPlaying = true;
  lastRowAdded = 0;
  road = [];

  constructor() {
    super(); // Call the superclass constructor
    this.lanes = []; // Initialize lanes as an empty array
  }

  async onInitialize(engine) {
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

    this.soundConfig = new SoundConfig();
    this.add(this.soundConfig);

    // Add gameelements bars to the middle of the screen
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
      this.camera.pos = new Vector(400, this.player.pos.y - 100);
    };

    // Load the level configuration from a text file
    this.layout = await this.loadLevelLayout("config/level1.txt");
    this.addRows(6);

    engine.input.keyboard.on("press", (e) => {
      if (e.key === Keys.S) {
        console.log("S key was pressed!");
        engine.toggleEffect();
      }
    });

    this.add(new GameOver());

    engine.events.on("gameStateChange", (event) => {
      if (event.gameState === GameState.GAMEOVER) {
        this.isPlaying = false;
      }
    });

    engine.setGameState(GameState.PLAYING);
  }

  addRows(topRowNeeded) {
    while (this.lastRowAdded < topRowNeeded) {
      // add row
      this.lastRowAdded++;
      this.generateRow(this.lastRowAdded);
    }
  }

  obstacleLeftScreen(row) {
    console.log("obstacle left screen");
    this.addRows(row + 6);
  }

  async loadLevelLayout(filePath) {
    // Fetch the level configuration from the text file
    const response = await fetch(filePath);
    const text = await response.text();
    return text.trim().split("\n"); // Split the layout into lines
  }

  generateRow(rowIndex) {
    const tiles = this.layout[rowIndex].split(""); // Split the line into individual characters
    const lanes = [];

    tiles.forEach((tile, colIndex) => {
      if (colIndex % 2 === 0) {
        const x = (colIndex / 2) * this.tileWidth; // Halve the colIndex for even places
        const y = -rowIndex * this.tileHeight; // Calculate the y position of the tile

        if (tile === "G") {
          // Add grass
          const grass = new Obstacle(x, y, this.tileWidth, this.tileHeight, rowIndex);
          this.add(grass);
        }
      } else {
        // add lane
        lanes.push((colIndex / 2) * this.tileWidth);
        const carClass = parseInt(tile);
        if (carClass > 0) {
          // add enemy cars
          const x = (colIndex / 2) * this.tileWidth; // Halve the colIndex for even places
          const y = -rowIndex * this.tileHeight; // Calculate the y position of the tile

          console.log("enemy at", x, y);

          this.add(createEnemyCar(carClass, new Vector(x, y)));
        }
      }
    });
    this.road.push(lanes);
  }

  getLanes(offset = 0) {
    // look half a tile forward
    const tileIndex = Math.floor(-offset / this.tileHeight + 0.5);
    if (tileIndex < this.road.length) {
      console.log("return road lanes");
      return this.road[tileIndex];
    } else {
      console.log("This part of the road does not exist (yet)", tileIndex, this.road.length);
      return [];
    }
  }

  addExplosion(pos, value) {
    const explosion = new Explosion(value);
    explosion.pos = pos;
    this.add(explosion);
    // TODO: create methods
    this.score.multiplierValue += BigInt(value);
  }
}
