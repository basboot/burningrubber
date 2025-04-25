import * as Tone from "tone";

export class MusicPlayer {
  constructor(midiData) {
    this.midiData = midiData;

    // Create synths and samplers for the instruments
    this.instruments = [
      new Tone.Synth({ oscillator: { type: "sawtooth" } }).toDestination(), // Bass Synth 1
      new Tone.Synth({ oscillator: { type: "sawtooth" } }).toDestination(), // Bass Synth 2
      new Tone.Synth({ oscillator: { type: "sine" } }).toDestination(), // Atmosphere Synth
      new Tone.Synth({ oscillator: { type: "square" } }).toDestination(), // Brass Synth
      new Tone.Synth({ oscillator: { type: "triangle" } }).toDestination(), // Contrabass
      new Tone.Noise({ type: "white" }).toDestination(), // Effect Synth 1
      new Tone.Synth({ oscillator: { type: "sine" } }).toDestination(), // Pad Synth 1
      new Tone.Synth({ oscillator: { type: "sawtooth" } }).toDestination(), // Brightness Synth
      new Tone.Synth({ oscillator: { type: "sine" } }).toDestination(), // Pad Synth 2
      new Tone.Sampler({
        C1: "https://tonejs.github.io/audio/drum-samples/CR78/kick.mp3",
        D1: "https://tonejs.github.io/audio/drum-samples/CR78/snare.mp3",
        E1: "https://tonejs.github.io/audio/drum-samples/CR78/hihat.mp3",
      }).toDestination(), // Percussion
      new Tone.Noise({ type: "white" }).toDestination(), // Effect Synth 2
      new Tone.Noise({ type: "white" }).toDestination(), // Effect Synth 3
      new Tone.Sampler({
        D1: "https://tonejs.github.io/audio/drum-samples/CR78/snare.mp3",
      }).toDestination(), // Snare 1
      new Tone.Sampler({
        D1: "https://tonejs.github.io/audio/drum-samples/CR78/snare.mp3",
      }).toDestination(), // Snare 2
      new Tone.Sampler({
        D1: "https://tonejs.github.io/audio/drum-samples/CR78/snare.mp3",
      }).toDestination(), // Snare 3
    ];
  }

  play() {
    const { header, tracks } = this.midiData;

    // Set the tempo
    const bpm = header.tempos[0]?.bpm || 120;
    Tone.Transport.bpm.value = bpm;

    // Schedule notes for each track
    tracks.forEach((track, index) => {
      const instrument = this.instruments[index];
      if (!instrument) return; // Skip if no instrument for this track

      track.notes.forEach((note) => {
        Tone.Transport.schedule((time) => {
          if (instrument instanceof Tone.Sampler) {
            // For samplers (e.g., drums)
            const drumNote = this.mapDrumMidiToSampler(note.midi);
            if (drumNote) {
              instrument.triggerAttack(drumNote, time, note.velocity);
            }
          } else if (instrument instanceof Tone.Noise) {
            // For noise instruments
            instrument.start(time);
            instrument.stop(time + note.duration);
          } else {
            // For synths
            instrument.triggerAttackRelease(
              Tone.Frequency(note.midi, "midi").toFrequency(),
              note.duration,
              time,
              note.velocity
            );
          }
        }, note.time);
      });
    });

    // Start the transport
    Tone.Transport.start();
  }

  // Map MIDI notes to drum sampler sounds
  mapDrumMidiToSampler(midi) {
    const drumMap = {
      36: "C1", // Kick
      38: "D1", // Snare
      42: "E1", // Hi-hat
    };
    return drumMap[midi] || null;
  }
}
