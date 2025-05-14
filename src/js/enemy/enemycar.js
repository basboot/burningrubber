import { Actor, Keys, Timer, vec, Vector } from "excalibur";
import { Player } from "tone";
import { Car } from "../gameelements/car/car.js";
import { Resources } from "../resources.js";

export class EnemyCar extends Car {
  targetX;

  constructor(initialPosition, initialVelocity, minSpeed, maxSpeed, carType, mass) {
    super(carType, initialPosition, initialVelocity, minSpeed, maxSpeed);

    this.body.mass = mass;

    this.canSteer = true;

    this.lastError = 0;
    this.hitByPLayer = false;
    this.targetX = initialPosition.x;
  }

  selectRandomLane(engine) {
    const lanes = engine.currentScene.getLanes();
    // try to randomly steer left or right
    if (lanes.length > 0) {
      const direction = Math.random() < 0.5 ? -1 : 1;
      if (lanes.includes(this.targetX + direction * engine.currentScene.tileWidth)) {
        this.targetX += direction * engine.currentScene.tileWidth;
      } else {
        if (lanes.includes(this.targetX - direction * engine.currentScene.tileWidth)) {
          this.targetX -= direction * engine.currentScene.tileWidth;
        }
      }
    }
  }

  onInitialize(engine) {
    super.onInitialize(engine);

    this.selectRandomLane(engine);

    // Switch lanes every 2-4 secs
    const timer = new Timer({
      randomRange: [0, 2000],
      interval: 2000,
      repeats: true,
      action: () => {
        this.selectRandomLane(engine);
      },
    });

    // TODO: shouldnt the timer be a child of the actor?
    engine.currentScene.add(timer);
    timer.start();

    this.on("exitviewport", () => {
      const camera = this.scene.camera;
      const bottomOfScreen = camera.pos.y + this.scene.engine.screen.resolution.height / 2;

      // Remove the actor only if it exits at the bottom of the screen
      if (this.pos.y > bottomOfScreen) {
        this.kill();
      }
    });

    // Listen for collisionstart event
    this.on("collisionstart", (event) => {
      // TODO: create property to make explicit that this is the Player, instead of carType
      if (event.other.owner.carType === "camaro") {
        // overlap = landing on top
        if (event.other.owner.collider.bounds.overlaps(this.collider.bounds, 15)) {
          this.scene.addExplosion(this.pos, this.body.mass);
          this.kill();
        } else {
          Resources.Crash1.play(Math.random() * 0.2 + 0.1);
          // disable steering 1sec when hit by player
          // but give player points when crashed within 2 secs
          this.canSteer = false;
          this.hitByPLayer = true;

          // add extra forward impact
          this.body.applyLinearImpulse(vec(0, -5000));

          const timer = new Timer({
            interval: 2000,
            repeats: false,
            action: () => {
              this.canSteer = true;
            },
          });

          this.scene.add(timer);

          const timer2 = new Timer({
            interval: 3000, // little longer than disabeling steer
            repeats: false,
            action: () => {
              this.hitByPLayer = false;
            },
          });

          this.scene.add(timer2);

          timer.start();
          timer2.start();
        }
      }
    });
  }

  update(engine, delta) {
    // const lanes = this.scene.getLanes(this.y); // Get all lanes

    // if (!lanes.includes(this.targetX)) {
    //   this.selectRandomLane(engine);
    // }

    // // Find the closest lane using reduce
    // const closestLane = lanes.reduce((closest, lane) => {
    //   return Math.abs(lane - this.pos.x) < Math.abs(closest - this.pos.x) ? lane : closest;
    // }, lanes[0]);
    //
    // const error = closestLane - this.pos.x;

    const error = this.targetX - this.pos.x;
    const deltaError = error - this.lastError;
    this.lastError = error;

    // Calculate the steering direction based on the error
    // use deltaError to reduce overshoot
    if (this.canSteer && Math.abs(error + deltaError * 20) > 10) {
      if (Math.sign(error) < 0) {
        this.steerLeft();
      } else {
        this.steerRight();
      }
    }

    super.update(engine, delta);
  }

  handleObstacleCollision(obstacle) {
    if (this.hitByPLayer) {
      // hit by player
      this.scene.addExplosion(this.pos, this.body.mass);
      this.kill();
    }
  }
}
