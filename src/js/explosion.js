import { Actor, Animation, AnimationStrategy, SpriteSheet } from "excalibur";
import { Resources } from "./resources";

export class Explosion extends Actor {
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
      50, // Duration per frame in milliseconds
      AnimationStrategy.Freeze // Animation strategy
    );

    animation.events.on("end", (a) => {
      console.log("explosion ended");
      this.endExplosion();
    });

    this.graphics.use(animation);
  }

  endExplosion() {
    this.kill();
  }
}
