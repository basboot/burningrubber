import {Scene, Vector, Color, Axis} from "excalibur";
import { Car } from "./car.js";
import { RoadBar } from "./roadbar.js";
import {Player} from "./player.js";
import {EnemyCar} from "./enemycar.js";

export class Level extends Scene {
  onInitialize(engine) {
    // Set the background color to grey
    this.backgroundColor = Color.Gray;

    // Create a car in the middle of the screen, moving upward
    const car = new Player("camaro", new Vector(400, 225), new Vector(0, -200), 200, 700);
    this.add(car);

    this.add(new EnemyCar(new Vector(300, -500), new Vector(0, -200), 200, 700))

    // Add road bars to the middle of the screen
    const barSpacing = 100; // Space between bars
    const barCount = Math.ceil(engine.drawHeight / barSpacing); // Number of bars to fill the screen
    for (let i = 0; i < barCount; i++) {
      const barY = i * barSpacing; // Calculate y position for each bar

      for (let i = 0; i < 4; i++) {
        const bar = new RoadBar(new Vector(250 + i * 100, barY)); // Place bar in the middle of the screen
        this.add(bar);
      }
    }

    // Lock the camera to follow the car in the y-direction only
    this.camera.strategy.lockToActorAxis(car, Axis.Y);
  }

  getLanes() {
    return [300, 400, 500];
  }
}
