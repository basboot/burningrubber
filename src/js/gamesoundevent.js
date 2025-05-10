import { GameEvent } from "excalibur";

export const GameSound = Object.freeze({
  EFFECT_ON: "EFFECT_ON",
  EFFECT_OFF: "EFFECT_OFF",
  MUSIC_ON: "MUSIC_ON",
  MUSIC_OFF: "MUSIC_OFF",
});

export class GameSoundEvent extends GameEvent {
  constructor(gameSound) {
    super();
    this.gameSound = gameSound;
  }
}
