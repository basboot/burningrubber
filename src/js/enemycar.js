import {Actor, Keys, Timer, Vector} from "excalibur";
import { CarSprites } from "./resources";
import { Car } from "./car.js";
import {Obstacle} from "./obstacle.js";
import {Player} from "tone";

export class EnemyCar extends Car {
  constructor(initialPosition, initialVelocity, minSpeed, maxSpeed) {
    console.log("EnemyCar constructed");

    // TODO: add full list to resources
    const carTypes = ["bmw", "lexus", "bike"];
    const masses = [1500, 500, 5];
    const selected = Math.floor(Math.random() * carTypes.length);

    super(carTypes[selected], initialPosition, initialVelocity, minSpeed, maxSpeed);
    console.log("EnemyCar constructed, end");

    this.body.mass = masses[selected];

    this.on("initialize", (event) => {
      console.log('Init of enemy');
    });

    this.canSteer = true;
  }

  onInitialize(engine) {
    console.log("EnemyCar initialized at:", this.pos);

    super.onInitialize(engine);


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
      console.log('Enemy collided with:', event.other.owner);
      // TODO: create property to make explicit that this is the Player, instead of carType
      if (event.other.owner.carType === "camaro") {
        console.log("hit by player");

        // disable steering 0.5sec when hit by player
        this.canSteer = false;

        const timer = new Timer({
          interval: 500,
          repeats: false,
          action: () => { this.canSteer = true; }
        });

        this.scene.add(timer);

        timer.start();

      }
    });
  }

  update(engine, delta) {

    const lanes = this.scene.getLanes(); // Get all lanes

    // Find the closest lane using reduce
    const closestLane = lanes.reduce((closest, lane) => {
      return Math.abs(lane - this.pos.x) < Math.abs(closest - this.pos.x) ? lane : closest;
    }, lanes[0]);

    // console.log(`Closest lane to EnemyCar: ${closestLane}`, this.pos);

    const error = closestLane - this.pos.x;

    if (this.canSteer && Math.abs(error) > 10) {
        if (Math.sign(error) < 0) {
            this.steerLeft();
        } else {
            this.steerRight();
        }
    }

    super.update(engine, delta);
  }
}
