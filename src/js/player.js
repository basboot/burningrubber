import {Actor, Keys, Vector} from "excalibur";
import { CarSprites } from "./resources";
import {Car} from "./car.js";

export class Player extends Car {
  constructor(carType, initialPosition, initialVelocity, minSpeed, maxSpeed) {
    super(carType, initialPosition, initialVelocity, minSpeed, maxSpeed);
  }

  onInitialize(engine) {
    this.graphics.use(CarSprites[this.carType]); // Use the sprite based on the car type

    // Listen for key press and release events
    engine.input.keyboard.on("press", (evt) => this.handleKeyPress(evt));
    engine.input.keyboard.on("release", (evt) => this.handleKeyRelease(evt));
  }

  update(engine, delta) {
    if (engine.input.keyboard.isHeld(Keys.ArrowUp)) {
      this.useThrottle();
    }
    if (engine.input.keyboard.isHeld(Keys.ArrowDown)) {
      this.useBreak();
    }

    super.update(engine, delta);
  }

  handleKeyPress(evt) {
    if (evt.key === "ArrowLeft") {
      this.steerLeft();
    } else if (evt.key === "ArrowRight") {
      this.steerRight();
    }
  }

  handleKeyRelease(evt) {
      this.vel.x = 0;
  }
}
