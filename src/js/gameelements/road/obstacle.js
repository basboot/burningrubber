import { Actor, CollisionType, Color, Shape, Vector } from "excalibur";

export class Obstacle extends Actor {
  row;
  constructor(x, y, width, height, row) {
    const position = new Vector(x, y);

    super({
      pos: position,
      width: width,
      height: height,
      color: new Color(0, 150, 0), // Darker green
      collisionType: CollisionType.Fixed, // Fixed collision type,
      anchor: new Vector(0, 1),
    });

    this.row = row;
  }

  onInitialize(engine) {
    // Add a rectangular collider
    this.collider.set(Shape.Box(this.width, this.height, new Vector(0, 1)));

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
