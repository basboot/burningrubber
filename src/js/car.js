import { Actor, clamp, CollisionType, DegreeOfFreedom, RotationType, Shape, vec } from "excalibur";
import { CarSprites } from "./resources";
import { Obstacle } from "./obstacle"; // Import the Obstacle class

export class Car extends Actor {
  constructor(carType, initialPosition, initialVelocity, minSpeed, maxSpeed) {
    super({ collisionType: CollisionType.Active });
    this.carType = carType; // Store the car type
    this.pos = initialPosition; // Set initial position
    this.vel = initialVelocity; // Set initial velocity
    this.minSpeed = minSpeed; // Minimum speed
    this.maxSpeed = maxSpeed; // Maximum speed

    this.gameOver = false;
  }

  onInitialize(engine) {
    this.graphics.use(CarSprites[this.carType]); // Use the sprite based on the car type

    const spriteWidth = CarSprites[this.carType].width;
    const spriteHeight = CarSprites[this.carType].height;

    this.collider.set(Shape.Box(spriteWidth, spriteHeight));

    // Listen for collisionstart event
    this.on("collisionstart", (event) => {
      console.log("Actor1 collided with:", event.other.owner instanceof Obstacle);
      if (event.other.owner instanceof Obstacle) {
        this.gameOver = true;
        this.handleObstacleCollision();
      }
    });

    this.body.bounciness = 1;
    this.body.friction = 0;

    this.body.limitDegreeOfFreedom.push(DegreeOfFreedom.Rotation);

    super.onInitialize(engine);
  }

  steerLeft() {
    this.body.applyLinearImpulse(vec(-25 * this.body.mass, 0));
  }

  steerRight() {
    this.body.applyLinearImpulse(vec(25 * this.body.mass, 0));
  }

  useThrottle() {
    this.vel.y -= 15; // Increase speed (move faster upward)
  }

  useBreak() {
    this.vel.y += 50; // Decrease speed (move slower upward)
  }

  update(engine, delta) {
    // Add drag
    this.vel.y += 5;
    // Clamp speed (reverse order because negative y direction)
    this.vel.y = clamp(this.vel.y, -this.maxSpeed, -this.minSpeed);

    // Reduce x movement
    if (Math.abs(this.vel.x) < 10) {
      this.vel.x = 0;
    } else {
      this.vel.x = this.vel.x - Math.sign(this.vel.x) * 10;
    }

    if (this.gameOver) {
      // TODO: explode?
      this.vel.x = 0;
      this.vel.y = 0;
    }

    this.rotation = this.vel.x / 2000;

    super.update(engine, delta);
  }

  handleObstacleCollision(obstacle) {}
}
