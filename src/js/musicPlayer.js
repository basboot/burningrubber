import * as Tone from "tone";

export class MusicPlayer {
  constructor(midiData, debugInstrument = null) {
    this.midiData = midiData;
    this.debugInstrument = "synth"; // Debug option to enable a single instrument

    // Create a master volume control
    this.volume = new Tone.Volume(-12).toDestination();

    // Map instruments dynamically based on the MIDI JSON
    this.instruments = this.midiData.tracks.map((track) => this.createInstrument(track.instrument.name));

    // Connect only valid Tone nodes to the volume
    this.instruments.forEach((instrument) => {
      if (instrument instanceof Tone.Synth || instrument instanceof Tone.Sampler) {
        instrument.connect(this.volume);
      }
    });
  }

  // Create an instrument based on the instrument name
  createInstrument(name) {
    switch (name.toLowerCase()) {
      case "bass synth":
        return this.createRetroSynth("sawtooth");
      case "atmosphere synth":
        return this.createRetroSynth("triangle");
      case "brass synth":
        return this.createRetroSynth("square");
      case "contrabass":
        return this.createRetroSynth("triangle");
      case "effect synth":
        return this.createNoiseSynth();
      case "pad synth":
        return this.createRetroSynth("sine");
      case "brightness synth":
        return this.createRetroSynth("sawtooth");
      case "percussion":
        return this.createDrumSampler();
      case "snare":
        return this.createDrumSampler();
      default:
        console.warn(`Unknown instrument: ${name}, using default synth.`);
        return this.createRetroSynth(); // Default to a basic synth
    }
  }

  // Create a retro synth with dramatic effects
  createRetroSynth(type = "square") {
    const synth = new Tone.Synth({
      oscillator: { type },
      envelope: {
        attack: 0.01,
        decay: 0.2,
        sustain: 0.3,
        release: 0.5,
      },
    });

    // Add effects
    const reverb = new Tone.Reverb({ decay: 2, wet: 0.5 }); // Spacious reverb
    const vibrato = new Tone.Vibrato(5, 0.1); // Subtle pitch modulation

    // Chain effects
    synth.chain(reverb, vibrato, Tone.Destination);
    return synth;
  }

  // Create a noise synth with subtle effects
  createNoiseSynth() {
    const noise = new Tone.Noise({ type: "white" });
    const noiseEnvelope = new Tone.AmplitudeEnvelope({
      attack: 0.01,
      decay: 0.2,
      sustain: 0.1,
      release: 0.3,
    });

    // Add effects
    const reverb = new Tone.Reverb({ decay: 1.5, wet: 0.4 }); // Add depth
    const delay = new Tone.FeedbackDelay(0.2, 0.3); // Add echo

    // Chain effects
    noise.chain(noiseEnvelope, delay, reverb, Tone.Destination);
    return {
      start: (time) => noise.start(time),
      stop: (time) => noise.stop(time),
    };
  }

  // Create a drum sampler with reverb for dramatic percussion
  createDrumSampler() {
    const sampler = new Tone.Sampler({
      C1: "https://tonejs.github.io/audio/drum-samples/CR78/kick.mp3",
      D1: "https://tonejs.github.io/audio/drum-samples/CR78/snare.mp3",
      E1: "https://tonejs.github.io/audio/drum-samples/CR78/hihat.mp3",
    });

    // Add effects
    const reverb = new Tone.Reverb({ decay: 1.2, wet: 0.5 }); // Add depth
    sampler.chain(reverb, Tone.Destination);

    return sampler;
  }

  setVolume(level) {
    this.volume.volume.value = Tone.gainToDb(level); // Convert linear gain to decibels
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

      // Skip scheduling if debugInstrument is set and doesn't match
      console.log(track.instrument.name.toLowerCase());
      if (this.debugInstrument && track.instrument.name.toLowerCase() !== this.debugInstrument.toLowerCase()) {
        return;
      }

      track.notes.forEach((note) => {
        Tone.Transport.schedule((time) => {
          if (instrument instanceof Tone.Sampler) {
            // For samplers (e.g., drums)
            const drumNote = this.mapDrumMidiToSampler(note.midi);
            if (drumNote) {
              instrument.triggerAttack(drumNote, time, note.velocity);
            }
          } else if (instrument.start && instrument.stop) {
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
