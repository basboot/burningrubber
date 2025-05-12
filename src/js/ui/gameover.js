import { Actor, Color, FontUnit, Label, Rectangle, ScreenElement, TextAlign, Vector } from "excalibur";
import {GameState} from "../events/gamestateevent.js";
import {Resources} from "../resources.js";
export class GameOver extends ScreenElement {
  onInitialize(engine) {
    this.pos = new Vector(0, 0);

    engine.events.on("gameStateChange", (event) => {
      if (event.gameState === GameState.GAMEOVER) {
        this.graphics.use(
          new Rectangle({
            width: 800,
            height: 500,
            color: Color.Black,
            z: 1000,
            opacity: 0.5,
          })
        );

        const gameoverLabel = new Label({
          text: event.levelCompleted ? "LEVEL COMPLETE" : `GAME OVER`,
          pos: new Vector(400, 200),
          font: Resources.PixelFont.toFont({
            unit: FontUnit.Px,
            size: 40,
            color: Color.Yellow,
            textAlign: TextAlign.Center,
          }),
        });
        this.addChild(gameoverLabel);
      }
    });
  }
}
