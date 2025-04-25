import * as Tone from "tone";

export class MusicPlayer {
  constructor(midiData) {
    this.midiData = midiData;
    this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
  }

  play() {
    const { header, tracks } = this.midiData;

    // Set the tempo
    const bpm = header.tempos[0]?.bpm || 120;
    Tone.Transport.bpm.value = bpm;

    // Schedule notes for each track
    tracks.forEach((track) => {
      track.notes.forEach((note) => {
        Tone.Transport.schedule((time) => {
          this.synth.triggerAttackRelease(
            Tone.Frequency(note.midi, "midi").toFrequency(),
            note.duration,
            time,
            note.velocity
          );
        }, note.time);
      });
    });

    // Start the transport
    Tone.Transport.start();
  }
}
