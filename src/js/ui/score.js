import { Color, FontUnit, Label, Rectangle, ScreenElement, TextAlign, Vector } from "excalibur";
import { Resources } from "../resources.js";
import { GameState } from "../events/gamestateevent.js";

export class Score extends ScreenElement {
  scoreLabel;
  highscoreLabel;
  score = BigInt(0);
  highscore = BigInt(123456789);
  highscorePlayer = "BAS";
  multiplierValue = BigInt(1);
  isPlaying = true;

  constructor(car) {
    super({
      x: 10,
      y: 10,
      z: 100,
    });

    this.car = car;
  }
  onInitialize(engine) {
    this.graphics.use(
      new Rectangle({
        width: 780,
        height: 40,
        color: Color.Black,
      })
    );

    const multiplier = new Label({
      text: `0`,
      pos: new Vector(10, 10),
      font: Resources.PixelFont.toFont({
        unit: FontUnit.Px,
        size: 20,
        color: Color.Red,
        textAlign: TextAlign.Left,
      }),
    });
    this.addChild(multiplier);

    this.multiplier = multiplier;

    const score = new Label({
      text: `0`,
      pos: new Vector(770, 10),
      font: Resources.PixelFont.toFont({
        unit: FontUnit.Px,
        size: 20,
        color: Color.Yellow,
        textAlign: TextAlign.Right,
      }),
    });
    this.addChild(score);

    this.scoreLabel = score;

    const highscore = new Label({
      text: `0`,
      pos: new Vector(770, 10),
      font: Resources.PixelFont.toFont({
        unit: FontUnit.Px,
        size: 20,
        color: Color.Yellow,
        textAlign: TextAlign.Right,
      }),
      opacity: 0.25,
    });
    this.addChild(highscore);

    this.highscoreLabel = highscore;

    engine.events.on("gameStateChange", (event) => {
      if (event.gameState === GameState.GAMEOVER) {
        this.isPlaying = false;
      }
    });
  }

  onPreUpdate(engine, delta) {
    // only achieve points while playing
    if (this.isPlaying) {
      // delta is 16.6 when running 60fps
      // TODO: reward driving faster?
      this.score += BigInt(Math.round(this.car.vel.y * -1)) * this.multiplierValue * BigInt(Math.round(delta / 16));
    }

    if (this.score > this.highscore) {
      this.highscore = this.score;
      this.highscorePlayer = "JIJ";
      this.highscoreLabel.opacity = 1;
    }
    this.scoreLabel.text = `${this.score}`;
    this.highscoreLabel.text = `${this.highscorePlayer} ${this.highscore}`;
    this.multiplier.text = `x ${this.multiplierValue}`;
  }
}
