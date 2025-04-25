import * as Tone from "tone";

export class MusicPlayer {
  constructor(midiData) {
    this.midiData = midiData;

    // Create a master volume control
    this.volume = new Tone.Volume(-12).toDestination();

    // Connect instruments to the master volume
    this.instruments = [
      this.createRetroSynth(), // Bass Synth 1
      this.createRetroSynth(), // Bass Synth 2
      this.createRetroSynth("triangle"), // Atmosphere Synth
      this.createRetroSynth(), // Brass Synth
      this.createRetroSynth("triangle"), // Contrabass
      this.createNoiseSynth(), // Effect Synth 1
      this.createRetroSynth(), // Pad Synth 1
      this.createRetroSynth(), // Brightness Synth
      this.createRetroSynth(), // Pad Synth 2
      this.createDrumSampler(), // Percussion
      this.createNoiseSynth(), // Effect Synth 2
      this.createNoiseSynth(), // Effect Synth 3
      this.createDrumSampler(), // Snare 1
      this.createDrumSampler(), // Snare 2
      this.createDrumSampler(), // Snare 3
    ];

    // Connect only valid Tone nodes to the volume
    this.instruments.forEach((instrument) => {
      if (instrument instanceof Tone.Synth || instrument instanceof Tone.Sampler) {
        instrument.connect(this.volume);
      }
    });
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
    const delay = new Tone.FeedbackDelay(0.25, 0.5); // Echo effect
    const reverb = new Tone.Reverb({ decay: 2, wet: 0.5 }); // Spacious reverb
    const vibrato = new Tone.Vibrato(5, 0.1); // Subtle pitch modulation

    // Chain effects
    synth.chain(delay, reverb, vibrato, Tone.Destination);
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
