import { Sound } from "excalibur";
import {GameSound} from "../events/gamesoundevent.js";

// Helper class to easily mute all sounds
export class SoundEffect extends Sound {
  // disable sound by default
  isEffectOn = false;

  play(vol) {
    if (this.isEffectOn) {
      super.play(vol);
    }
  }

  wireEngine(engine) {
    console.log(engine);
    engine.events.on("gameSoundChange", (event) => {
      if (event.gameSound === GameSound.EFFECT_ON) {
        this.isEffectOn = true;
        console.log("effects on");
      }
      if (event.gameSound === GameSound.EFFECT_OFF) {
        this.isEffectOn = false;
        console.log("effects off");
        this.stop();
      }
    });
  }
}
