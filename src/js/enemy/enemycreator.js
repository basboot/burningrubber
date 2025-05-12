import { Actor, Color, Entity, Timer, Vector } from "excalibur";
import { EnemyCar } from "./enemycar.js";
import {CAR_DATA} from "../resources.js";
const classToWeight = [
  null, // index 0 not used
  5, // class 1: bikes
  null, // class 2: (not used in this vehicle set)
  500, // class 3: small cars (e.g. compact convertibles, basic figos)
  600, // class 4: smaller off-roaders/crossovers (e.g. wranglers, sunny)
  750, // class 5: mid-sized sedans and sporty coupes (e.g. bmw, lancer)
  1000, // class 6: performance/sport sedans and coupes (e.g. mustang2, camaros)
  1500, // class 7: pickups and small SUVs (e.g. pickups, some suvs)
  2500, // class 8: larger SUVs and off-roaders (e.g. landcruisers, raptors)
  5000, // class 9: trucks/tow trucks
  100000, // class 10: dumptruck (the heaviest)
];

export class EnemyCreator extends Actor {
  constructor() {
    super();

    this.cars = Object.keys(CAR_DATA);
    // remove player car from possible cars
    // TODO: make configurable
    this.cars = this.cars.filter((car) => car !== "camaro");

    this.lastEnemyInLane = [0, 0, 0, 0, 0, 0, 0];
  }

  onInitialize(engine) {
    // Create a timer that fires every 1 second (1000 ms) and repeats 5 times
    const timer = new Timer({
      randomRange: [0, 500],
      interval: 500,
      repeats: true,
      action: () => {
        this.spawnEnemy(engine);
      },
    });

    this.scene.add(timer);

    timer.start();

    super.onInitialize(engine);
  }

  spawnEnemy(engine) {
    const camera = this.scene.camera;
    // TODO: check car size
    const topOfScreen = camera.pos.y - this.scene.engine.screen.resolution.height / 2 - 50;

    // TODO: create logic, now just spawn about once in a second
    if (Math.random() < 1) {
      const lane = Math.floor(Math.random() * 3);
      // avoid spawning in same place
      if (this.lastEnemyInLane[lane + 2] > topOfScreen + 50) {
        // select carType and mass

        const carType = this.cars[Math.floor(Math.random() * this.cars.length)];
        const mass = classToWeight[CAR_DATA[carType].class];

        const enemyCar = new EnemyCar(
          new Vector(300 + 100 * lane, topOfScreen),
          new Vector(0, -200),
          300,
          700,
          carType,
          mass
        );

        // Add the enemy car to the scene explicitly
        // enemyCar._initialize(engine);
        this.scene.add(enemyCar);

        // Update last enemy position in the lane
        this.lastEnemyInLane[lane + 2] = topOfScreen;
      }
    }
  }
}
