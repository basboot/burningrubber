import {Actor, clamp, CollisionType, DegreeOfFreedom, Shape, vec} from "excalibur";
import { CarSprites } from "./resources";

export class Car extends Actor {
  constructor(carType, initialPosition, initialVelocity, minSpeed, maxSpeed) {
    super({ collisionType: CollisionType.Active });
    this.carType = carType; // Store the car type
    this.pos = initialPosition; // Set initial position
    this.vel = initialVelocity; // Set initial velocity
    this.minSpeed = minSpeed; // Minimum speed
    this.maxSpeed = maxSpeed; // Minimum speed
  }

  onInitialize(engine) {
    this.graphics.use(CarSprites[this.carType]); // Use the sprite based on the car type

    const spriteWidth = CarSprites[this.carType].width;
    const spriteHeight = CarSprites[this.carType].height;

    this.collider.set(Shape.Box(spriteWidth, spriteHeight));

    // Listen for collisionstart event
    this.on("collisionstart", (event) => {
      console.log("Collision detected with:", event.other);
    });

    this.body.bounciness = 1;
    this.body.friction = 0;

    this.body.limitDegreeOfFreedom.push(DegreeOfFreedom.Rotation);

  }

  steerLeft() {
    this.body.applyLinearImpulse(vec(-250, 0));
  }

  steerRight() {
    this.body.applyLinearImpulse(vec(250, 0));
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
    this.vel.y = clamp(this.vel.y, -this.maxSpeed, -this.minSpeed);

    // reduce x movement
    if (Math.abs(this.vel.x) < 10) {
      this.vel.x = 0;
    } else {
      this.vel.x = this.vel.x - Math.sign(this.vel.x) * 10;
    }
  }
}
