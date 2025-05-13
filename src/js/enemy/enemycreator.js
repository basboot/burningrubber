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

const classToCars = [
  [], // index 0 not used
  [], // class 1: bikes
  [], // class 2: small cars
  [], // class 3: player and midweight
  [], // class 4: heavy
  [], // class 5: dumptruck (the heaviest)
];

// Populate classToCars with cars from CAR_DATA
for (const [carName, carData] of Object.entries(CAR_DATA)) {
  const carClass = carData.class;
  if (classToCars[carClass]) {
    classToCars[carClass].push(carName);
  }
}

export function createEnemyCar(carClass, position) {
  if (!classToCars[carClass] || classToCars[carClass].length === 0) {
    throw new Error(`No cars available for class ${carClass}`);
  }

  const carType = classToCars[carClass][Math.floor(Math.random() * classToCars[carClass].length)];
  // const carData = CAR_DATA[carType];
  const mass = classToWeight[carClass];

  // TODO: base speed on weight
  return new EnemyCar(position, Vector.Zero, 350, 700, carType, mass);
}
