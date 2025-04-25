import {Actor, clamp, Keys, Vector} from "excalibur";
import { CarSprites } from "./resources";

export class Car extends Actor {
  constructor(carType, initialPosition, initialVelocity, minSpeed, maxSpeed) {
    super();
    this.carType = carType; // Store the car type
    this.pos = initialPosition; // Set initial position
    this.vel = initialVelocity; // Set initial velocity
    this.minSpeed = minSpeed; // Minimum speed
    this.maxSpeed = maxSpeed; // Minimum speed
  }

  onInitialize(engine) {
    this.graphics.use(CarSprites[this.carType]); // Use the sprite based on the car type

  }

  steerLeft() {
    this.vel.x = -200; // Move left
  }

  steerRight() {
    this.vel.x = 200; // Move right
  }

  useThrottle() {
    this.vel.y -= 15; // Increase speed (move faster upward)
  }

  useBreak() {
    this.vel.y += 50; // Decrease speed (move slower upward)
  }

  update(engine, delta) {
    // add drag
    this.vel.y += 5;
    // clamp speed (reverse order because negative y direction)
    console.log(this.vel.y, -this.maxSpeed, -this.minSpeed)
    this.vel.y = clamp(this.vel.y, -this.maxSpeed, -this.minSpeed);
  }

}
