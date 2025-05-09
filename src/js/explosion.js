import { Actor, Animation, AnimationStrategy, Color, FontUnit, Label, SpriteSheet, Timer, Vector } from "excalibur";
import { Resources } from "./resources";

export class Explosion extends Actor {
  points;

  constructor(points = 1000, options) {
    super(options);

    this.points = points; // Set the points for the explosion
  }

  onInitialize(engine) {
    const spriteSheet = SpriteSheet.fromImageSource({
      image: Resources.Explosion,
      grid: {
        rows: 1,
        columns: 11,
        spriteWidth: 64,
        spriteHeight: 64,
      },
    });

    const animation = Animation.fromSpriteSheet(
      spriteSheet,
      Array.from({ length: 11 }, (_, i) => i), // Frame indices
      25, // Duration per frame in milliseconds
      AnimationStrategy.End // Animation strategy
    );

    this.endExplosion();

    // animation.events.on("end", (a) => {
    //   console.log("explosion ended");
    // });

    this.graphics.use(animation);
  }

  endExplosion() {
    const score = new Label({
      text: `${this.points}`,
      pos: new Vector(0, 0),
      font: Resources.PixelFont.toFont({
        unit: FontUnit.Px,
        size: 20,
        color: Color.Red,
      }),
    });
    this.addChild(score);

    score.actions.fade(0, 1000);
    score.vel.y = -200;

    const timer = new Timer({
      interval: 1000,
      repeats: false,
      action: () => {
        this.kill();
      },
    });

    this.scene.add(timer);
  }
}
