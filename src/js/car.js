import {Actor, Keys, Vector} from "excalibur";
import { CarSprites } from "./resources";

export class Car extends Actor {
  constructor(carType, initialPosition, initialVelocity) {
    super();
    this.carType = carType; // Store the car type
    this.pos = initialPosition; // Set initial position
    this.vel = initialVelocity; // Set initial velocity
    this.minSpeed = 200; // Minimum speed
    this.maxSpeed = 500; // Minimum speed
  }

  onInitialize(engine) {
    this.graphics.use(CarSprites[this.carType]); // Use the sprite based on the car type

    // Listen for key press and release events
    engine.input.keyboard.on("press", (evt) => this.handleKeyPress(evt));
    engine.input.keyboard.on("release", (evt) => this.handleKeyRelease(evt));
  }

  update(engine, delta) {
    if (engine.input.keyboard.isHeld(Keys.ArrowUp)) {
      console.log(this.vel.y);
      this.vel.y = Math.max(this.vel.y - 10, -this.maxSpeed); // Increase speed (move faster upward)
    } else {
      this.vel.y += 5;
    }
    if (engine.input.keyboard.isHeld(Keys.ArrowDown)) {
      this.vel.y += 50; // Decrease speed (move slower upward)
    }
    this.vel.y = Math.min(this.vel.y, -this.minSpeed);
  }

  handleKeyPress(evt) {
    if (evt.key === "ArrowLeft") {
      this.vel.x = -200; // Move left
    } else if (evt.key === "ArrowRight") {
      this.vel.x = 200; // Move right
    }
  }

  handleKeyRelease(evt) {
      this.vel.x = 0;
  }
}
