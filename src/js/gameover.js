import { Actor, Color, Rectangle, ScreenElement, Vector } from "excalibur";

export class GameOver extends ScreenElement {
  onInitialize(engine) {
    console.log("create gameover");
    this.graphics.use(
      new Rectangle({
        width: 800,
        height: 500,
        color: Color.Black,
        z: 1000,
        opacity: 0.5,
      })
    );
    this.pos = new Vector(0, 0);
  }
}
