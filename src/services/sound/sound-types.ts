const p5 = require('p5');
const p5sound = require('p5sound');

import { IP5 } from './index';

export enum SoundType {
  MIDI_OSC,
};

export type SoundContext = {
  time: number,
  type: SoundType,
  gain: any,
  data: any,
  p5: IP5,
};

export type MidiOscOptions = {
  note: number,
  attackLevel: number,
  releaseLevel: number,
  attackTime: number,
  decayTime: number,
  susPercent: number,
  releaseTime: number,
};

const DEFAULT_MIDI_OSC_OPTIONS: MidiOscOptions = {
  note: 0,
  attackLevel: 1.0,
  releaseLevel: 0,
  attackTime: 0.001,
  decayTime: 0.2,
  susPercent: 0.2,
  releaseTime: 0.5,
};

export function playSound(sound: SoundContext) {
  switch (sound.type) {
    case SoundType.MIDI_OSC:

      const midiOptions: MidiOscOptions = 
        Object.assign({}, DEFAULT_MIDI_OSC_OPTIONS, sound.data);

      // console.debug('playSound[MIDI]:', sound, midiOptions);

      const env = new p5.Env();
      env.setADSR(midiOptions.attackTime,
                  midiOptions.decayTime,
                  midiOptions.susPercent,
                  midiOptions.releaseTime);

      env.setRange(midiOptions.attackLevel, midiOptions.releaseLevel);

      const osc = new p5.SinOsc();

      // plug the oscillator into the gain
      osc.disconnect();
      sound.gain.setInput(osc);

      osc.start(sound.time);
      osc.freq(sound.p5.midiToFreq(midiOptions.note));
      env.play(osc, sound.time);
      setTimeout(() => {
        env.dispose();
        osc.dispose();
      }, sound.time + 10000); // TODO: Improve this timeout
      break;

    default:
      break;
  }
};
