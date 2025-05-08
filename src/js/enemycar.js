import { Actor, Keys, Timer, Vector } from "excalibur";
import { CarSprites } from "./resources";
import { Car } from "./car.js";
import { Obstacle } from "./obstacle.js";
import { Player } from "tone";

export class EnemyCar extends Car {
  constructor(initialPosition, initialVelocity, minSpeed, maxSpeed) {
    console.log("EnemyCar constructed");

    // TODO: add information to list to resources
    const carTypes = ["bmw", "lexus", "bike"];
    const masses = [1500, 500, 5];
    const selected = Math.floor(Math.random() * carTypes.length);

    super(carTypes[selected], initialPosition, initialVelocity, minSpeed, maxSpeed);
    console.log("EnemyCar constructed, end");

    this.body.mass = masses[selected];

    this.on("initialize", (event) => {
      console.log("Init of enemy");
    });

    this.canSteer = true;

    this.lastError = 0;
    this.hitByPLayer = false;
  }

  selectRandomLane(engine) {
    this.selectedLane = Math.floor(Math.random() * engine.currentScene.getLanes().length);
  }

  onInitialize(engine) {
    console.log("EnemyCar initialized at:", this.pos);

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
        console.log("enemy has left the building");
      }
    });

    // Listen for collisionstart event
    this.on("collisionstart", (event) => {
      console.log("Enemy collided with:", event.other.owner);
      // TODO: create property to make explicit that this is the Player, instead of carType
      if (event.other.owner.carType === "camaro") {
        console.log("hit by player");

        // disable steering 1sec when hit by player
        // but give player points when crashed within 2 secs
        this.canSteer = false;
        this.hitByPLayer = true;

        const timer = new Timer({
          interval: 10000,
          repeats: false,
          action: () => {
            this.canSteer = true;
          },
        });

        this.scene.add(timer);

        const timer2 = new Timer({
          interval: 2000,
          repeats: false,
          action: () => {
            this.hitByPLayer = false;
          },
        });

        this.scene.add(timer2);

        timer.start();
        timer2.start();
      }
    });
  }

  update(engine, delta) {
    const lanes = this.scene.getLanes(); // Get all lanes

    if (this.selectedLane > lanes.length - 1) {
      this.selectedLane = lanes.length - 1;
    }

    // // Find the closest lane using reduce
    // const closestLane = lanes.reduce((closest, lane) => {
    //   return Math.abs(lane - this.pos.x) < Math.abs(closest - this.pos.x) ? lane : closest;
    // }, lanes[0]);
    //
    // const error = closestLane - this.pos.x;

    const error = lanes[this.selectedLane] - this.pos.x;
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
      this.scene.addExplosion(this.pos);
      this.kill();
    }
  }
}
