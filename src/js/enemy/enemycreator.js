import { Actor, Color, Entity, Timer, Vector } from "excalibur";
import { EnemyCar } from "./enemycar.js";
import { CAR_DATA } from "../resources.js";
const classToWeight = [
  null, // index 0 not used
  5, // class 1: bikes
  500, // class 2: small cars
  1000, // class 3: player and midweight
  2500, // class 4: heavy
  100000, // class 5: dumptruck (the heaviest)
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
