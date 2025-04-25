import { Actor, Vector } from "excalibur";
import { CarSprites } from "./resources";

export class Car extends Actor {
  constructor(carType, initialPosition, initialVelocity) {
    super();
    this.carType = carType; // Store the car type
    this.pos = initialPosition; // Set initial position
    this.vel = initialVelocity; // Set initial velocity
    this.minSpeed = 200; // Minimum speed
  }

  onInitialize(engine) {
    this.graphics.use(CarSprites[this.carType]); // Use the sprite based on the car type

    // Listen for key press and release events
    engine.input.keyboard.on("press", (evt) => this.handleKeyPress(evt));
    engine.input.keyboard.on("release", (evt) => this.handleKeyRelease(evt));
  }

  handleKeyPress(evt) {
    if (evt.key === "ArrowLeft") {
      this.vel.x = -200; // Move left
    } else if (evt.key === "ArrowRight") {
      this.vel.x = 200; // Move right
    } else if (evt.key === "ArrowUp") {
      this.vel.y = this.vel.y - 50; // Increase speed (move faster upward)
    } else if (evt.key === "ArrowDown") {
      this.vel.y = this.vel.y + 50; // Decrease speed (move slower upward)
    }
  }

  handleKeyRelease(evt) {
    if (evt.key === "ArrowLeft" || evt.key === "ArrowRight") {
      this.vel.x = 0; // Stop horizontal movement
    }
  }
}
