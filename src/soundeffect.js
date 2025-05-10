import { Sound } from "excalibur";

// Helper class to easily mute all sounds
export class SoundEffect extends Sound {
  // disable sound by default
  isSoundOn = false;

  play(vol) {
    if (this.isSoundOn) {
      super.play(vol);
    }
  }

  wireEngine(engine) {
    // TODO: listen to emitter to set isSoundOn
    console.log("WIRE ENGINE");
  }
}
