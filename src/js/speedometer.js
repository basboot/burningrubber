import { Color, FontUnit, Label, Rectangle, ScreenElement, TextAlign, Vector } from "excalibur";
import { Resources } from "./resources";

export class Speedometer extends ScreenElement {
  score;

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
        width: 200,
        height: 40,
        color: Color.Black,
      })
    );

    const score = new Label({
      text: `0`,
      pos: new Vector(180, 10),
      font: Resources.PixelFont.toFont({
        unit: FontUnit.Px,
        size: 20,
        color: Color.Yellow,
        textAlign: TextAlign.Right,
      }),
    });
    this.addChild(score);

    this.score = score;
  }

  onPreUpdate(engine, delta) {
    this.score.text = `${Math.round(this.car.vel.y * -1)} km/u`;
  }
}
