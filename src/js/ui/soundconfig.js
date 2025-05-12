import { Color, FontUnit, Label, Rectangle, ScreenElement, TextAlign, Vector } from "excalibur";
import {Resources} from "../resources.js";
import {GameSound} from "../events/gamesoundevent.js";

export class SoundConfig extends ScreenElement {
  effectSymbol;
  bar;

  constructor() {
    super({
      x: 750,
      y: 450,
      z: 40,
    });
  }
  onInitialize(engine) {
    this.rectangleGraphic = new Rectangle({
      width: 40,
      height: 40,
      color: Color.Black,
      opacity: 0,
    });
    this.graphics.use(this.rectangleGraphic);

    // ♪ ✶ ≈ ✦ ✧ ✪ ✨ ★ ☆ ☀ ☁ ☂ ☄ ☾ ☽ ♫ ♬ ♡ ♥

    const score = new Label({
      text: `♪`,
      pos: new Vector(10, 10),
      font: Resources.PixelFont.toFont({
        unit: FontUnit.Px,
        size: 20,
        color: Color.Yellow,
        textAlign: TextAlign.Left,
      }),
    });

    const score2 = new Label({
      text: `\\`,
      pos: new Vector(10, 10),
      font: Resources.PixelFont.toFont({
        unit: FontUnit.Px,
        size: 20,
        color: Color.Yellow,
        textAlign: TextAlign.Left,
      }),
    });

    this.effectSymbol = score;
    this.bar = score2;

    if (!engine.isEffectOn) {
      this.showEffectsOff();
    }

    engine.events.on("gameSoundChange", (event) => {
      if (event.gameSound === GameSound.EFFECT_ON) {
        this.showEffectsOn();
      }
      if (event.gameSound === GameSound.EFFECT_OFF) {
        this.showEffectsOff();
      }
    });
  }

  showEffectsOn() {
    this.rectangleGraphic.opacity = 0;
    this.removeChild(this.effectSymbol);
    this.removeChild(this.bar);
  }

  showEffectsOff() {
    this.rectangleGraphic.opacity = 1;
    this.addChild(this.effectSymbol);
    this.addChild(this.bar);
  }

  onPreUpdate(engine, delta) {}
}
