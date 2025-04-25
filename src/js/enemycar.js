import { Actor, Keys, Vector } from "excalibur";
import { CarSprites } from "./resources";
import { Car } from "./car.js";

export class EnemyCar extends Car {
  constructor(initialPosition, initialVelocity, minSpeed, maxSpeed) {
    super("lexus", initialPosition, initialVelocity, minSpeed, maxSpeed);
  }

  onInitialize(engine) {
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
  }
  
  update(engine, delta) {
    const lanes = this.scene.getLanes(); // Get all lanes

    // Find the closest lane using reduce
    const closestLane = lanes.reduce((closest, lane) => {
      return Math.abs(lane - this.pos.x) < Math.abs(closest - this.pos.x) ? lane : closest;
    }, lanes[0]);

    console.log(`Closest lane to EnemyCar: ${closestLane}`);

    const error = closestLane - this.pos.x;

    if (Math.abs(error) > 10) {
        if (Math.sign(error) < 0) {
            this.steerLeft();
        } else {
            this.steerRight();
        }
    }

    super.update(engine, delta);
  }
}
