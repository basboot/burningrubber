import * as Tone from "tone";

export class MusicPlayer {
  constructor(midiData) {
    this.midiData = midiData;

    // Create synths for the tracks with 8-bit retro sound
    this.leadSynth = new Tone.Synth({
      oscillator: { type: "square" }, // 8-bit square wave
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.4,
        release: 0.1,
      },
    })
      .connect(new Tone.BitCrusher(4))
      .toDestination(); // Add bitcrushing for 8-bit effect

    this.polySynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" }, // 8-bit triangle wave
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.4,
        release: 0.1,
      },
    })
      .connect(new Tone.BitCrusher(4))
      .toDestination(); // Add bitcrushing for 8-bit effect

    this.drumSampler = new Tone.Sampler({
      C1: "https://tonejs.github.io/audio/drum-samples/CR78/kick.mp3",
      D1: "https://tonejs.github.io/audio/drum-samples/CR78/snare.mp3",
      E1: "https://tonejs.github.io/audio/drum-samples/CR78/hihat.mp3",
    })
      .connect(new Tone.BitCrusher(4))
      .toDestination(); // Add bitcrushing for drums
  }

  play() {
    const { header, tracks } = this.midiData;

    // Set the tempo
    const bpm = header.tempos[0]?.bpm || 120;
    Tone.Transport.bpm.value = bpm;

    // Schedule notes for each track
    tracks.forEach((track, index) => {
      if (index === 0) {
        // Lead track with square wave
        track.notes.forEach((note) => {
          Tone.Transport.schedule((time) => {
            this.leadSynth.triggerAttackRelease(
              Tone.Frequency(note.midi, "midi").toFrequency(),
              note.duration,
              time,
              note.velocity
            );
          }, note.time);
        });
      } else if (index === 1) {
        // Polyphonic track with triangle wave
        track.notes.forEach((note) => {
          Tone.Transport.schedule((time) => {
            this.polySynth.triggerAttackRelease(
              Tone.Frequency(note.midi, "midi").toFrequency(),
              note.duration,
              time,
              note.velocity
            );
          }, note.time);
        });
      } else if (index === 2) {
        // Drum track
        track.notes.forEach((note) => {
          Tone.Transport.schedule((time) => {
            const drumNote = this.mapDrumMidiToSampler(note.midi);
            if (drumNote) {
              this.drumSampler.triggerAttack(drumNote, time, note.velocity);
            }
          }, note.time);
        });
      }
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
