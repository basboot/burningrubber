import {Actor, CollisionType, Color, Shape, Vector} from "excalibur";

export class Grass extends Actor {
    constructor(x, y, width, isLeft) {
        const height = 10; // Fixed height for grass
        const position = isLeft
            ? new Vector(x - width / 2, y + height / 2) // Adjust for left side
            : new Vector(x + width / 2, y + height / 2); // Adjust for right side

        super({
            pos: position,
            width: width,
            height: height,
            color: Color.Green,
            collisionType: CollisionType.Fixed, // Fixed collision type
        });
    }

    onInitialize(engine) {
        // Add a rectangular collider
        this.collider.set(Shape.Box(this.width, this.height));

        this.on("exitviewport", () => {
            const camera = this.scene.camera;
            const bottomOfScreen = camera.pos.y + this.scene.engine.screen.resolution.height / 2;

            // Remove the actor only if it exits at the bottom of the screen
            if (this.pos.y > bottomOfScreen) {
                this.pos.y -= engine.drawHeight + this.height * 2; // Reset position when leaving the viewport
            }
        });
    }
}
