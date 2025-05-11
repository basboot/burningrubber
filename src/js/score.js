import { Color, FontUnit, Label, Rectangle, ScreenElement, TextAlign, Vector } from "excalibur";
import { Resources } from "./resources";
import { GameState } from "./gamestateevent";

export class Score extends ScreenElement {
  score;
  scoreValue = BigInt(0); // TODO: use better names
  highscoreValue = BigInt(13456789); // TODO: use better names
  highscoreName = "BAS"; // TODO: use better names
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

    this.score = score;

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

    this.highscore = highscore;

    engine.events.on("gameStateChange", (event) => {
      if (event.gameState === GameState.GAMEOVER) {
        this.isPlaying = false;
      }
    });
  }

  onPreUpdate(engine, delta) {
    // only achieve points while playing
    // TODO: use delta, to avoid scoring depending on fps
    if (this.isPlaying) {
      this.scoreValue += BigInt(Math.round(this.car.vel.y * -1)) * this.multiplierValue;
    }

    if (this.scoreValue > this.highscoreValue) {
      this.highscoreValue = this.scoreValue;
      this.highscoreName = "JIJ";
      this.highscore.opacity = 1;
    }
    this.score.text = `${this.scoreValue}`;
    this.highscore.text = `${this.highscoreName} ${this.highscoreValue}`;
    this.multiplier.text = `x ${this.multiplierValue}`;
  }
}
