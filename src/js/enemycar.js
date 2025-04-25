import {Actor, Keys, Vector} from "excalibur";
import { CarSprites } from "./resources";
import {Car} from "./car.js";

export class EnemyCar extends Car {
    constructor(initialPosition, initialVelocity, minSpeed, maxSpeed) {
        super("lexus", initialPosition, initialVelocity, minSpeed, maxSpeed);
    }

    onInitialize(engine) {
        super.onInitialize(engine);

        this.on('exitviewport', () => {
            const camera = this.scene.camera;
            const bottomOfScreen = camera.pos.y + this.scene.engine.screen.resolution.height / 2;

            // Remove the actor only if it exits at the bottom of the screen
            if (this.pos.y > bottomOfScreen) {
                this.kill();
                console.log("enemy has left the building");
            }


        });
    }



    // add lane following and maybe changing


}
