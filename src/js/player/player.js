import { Actor, CollisionType, Keys, Vector } from "excalibur";
import { GameState } from "../events/gamestateevent.js";
import { Car } from "../gameelements/car/car.js";
import { Resources } from "../resources.js";

export class Player extends Car {
  jumping;
  jumpTime;
  gameOver = false;
  levelEnd = -13500;

  constructor(carType, initialPosition, initialVelocity, minSpeed, maxSpeed) {
    super(carType, initialPosition, initialVelocity, minSpeed, maxSpeed);
  }

  onInitialize(engine) {
    this.jumping = false;
    this.body.mass = 1000;

    engine.input.keyboard.on("press", (evt) => {
      if (evt.key === Keys.Space) {
        this.body.collisionType = CollisionType.PreventCollision;
        this.jumpTime = this.scene.engine.clock.now();
        this.jumping = true;
        Resources.Jump.play(0.5);
      }
    });

    this.z = 10;

    engine.events.on("gameStateChange", (event) => {
      if (event.gameState === GameState.GAMEOVER) {
        this.gameOver = true;
      }
    });

    super.onInitialize(engine);
  }

  onPreUpdate(engine, delta) {
    // TODO: this must not be hardcoded, but added to the level creation when level creation is dynamic
    if (this.pos.y < this.levelEnd && !this.gameOver) {
      engine.setGameState(GameState.GAMEOVER, true);
    }

    if (!this.gameOver) {
      // console.log(this.pos);
      if (!this.jumping) {
        if (engine.input.keyboard.isHeld(Keys.ArrowUp)) {
          this.useThrottle();
        }
        if (engine.input.keyboard.isHeld(Keys.ArrowDown)) {
          this.useBreak();
        }
      }
      if (engine.input.keyboard.isHeld(Keys.ArrowLeft)) {
        if (!this.jumping) {
          this.steerLeft();
        } else {
          this.vel.x = -150;
        }
      }
      if (engine.input.keyboard.isHeld(Keys.ArrowRight)) {
        if (!this.jumping) {
          this.steerRight();
        } else {
          this.vel.x = 150;
        }
      }
    }

    if (this.jumping) {
      const t = (engine.clock.now() - this.jumpTime) * 0.0004 * Math.PI;
      if (t >= Math.PI) {
        this.body.collisionType = CollisionType.Active;
        this.jumping = false;
      }
      const s = 1 + Math.sin(t);
      this.scale = new Vector(s, s);
    }
  }

  handleObstacleCollision() {
    this.kill();
    this.scene.addExplosion(this.pos, 0);
    this.scene.engine.setGameState(GameState.GAMEOVER, false);
  }
}
