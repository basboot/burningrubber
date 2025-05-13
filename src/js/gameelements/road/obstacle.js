import { Actor, CollisionType, Color, Shape, Vector } from "excalibur";

export class Obstacle extends Actor {
  row;
  constructor(x, y, width, height, row) {
    const position = new Vector(x + width / 2, y + height / 2);

    super({
      pos: position,
      width: width,
      height: height,
      color: new Color(0, 150, 0), // Darker green
      collisionType: CollisionType.Fixed, // Fixed collision type
    });

    this.row = row;
  }

  onInitialize(engine) {
    // Add a rectangular collider
    this.collider.set(Shape.Box(this.width, this.height));

    this.on("exitviewport", () => {
      const camera = this.scene.camera;
      const bottomOfScreen = camera.pos.y + this.scene.engine.screen.resolution.height / 2;

      // Remove the actor only if it exits at the bottom of the screen
      if (this.pos.y > bottomOfScreen) {
        this.kill();
        this.scene.obstacleLeftScreen(this.row);
      }
    });

    this.body.friction = 0;
  }
}
