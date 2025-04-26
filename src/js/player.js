import {Actor, Keys, Vector} from "excalibur";
import { CarSprites } from "./resources";
import {Car} from "./car.js";

export class Player extends Car {
  constructor(carType, initialPosition, initialVelocity, minSpeed, maxSpeed) {
    super(carType, initialPosition, initialVelocity, minSpeed, maxSpeed);
  }

  onInitialize(engine) {
    this.body.mass = 1000;
    super.onInitialize(engine);

   }

  update(engine, delta) {
    // console.log(this.pos);
    if (engine.input.keyboard.isHeld(Keys.ArrowUp)) {
      this.useThrottle();
    }
    if (engine.input.keyboard.isHeld(Keys.ArrowDown)) {
      this.useBreak();
    }
    if (engine.input.keyboard.isHeld(Keys.ArrowLeft)) {
      this.steerLeft();
    }
    if (engine.input.keyboard.isHeld(Keys.ArrowRight)) {
      this.steerRight();
    }

    super.update(engine, delta);
  }
}
