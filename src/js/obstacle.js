import { Actor, CollisionType, Color, Shape, Vector } from "excalibur";

export class Obstacle extends Actor {
  constructor(x, y, width, height) {
    const position = new Vector(x + width / 2, y + height / 2);

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

    // this.on("exitviewport", () => {
    //     const camera = this.scene.camera;
    //     const bottomOfScreen = camera.pos.y + this.scene.engine.screen.resolution.height / 2;

    //     // Remove the actor only if it exits at the bottom of the screen
    //     if (this.pos.y > bottomOfScreen) {
    //         this.pos.y -= engine.drawHeight + this.height * 2; // Reset position when leaving the viewport
    //     }
    // });

    this.body.friction = 0;
  }

  update(engine, elapsed) {
    super.update(engine, elapsed);
  }
}
