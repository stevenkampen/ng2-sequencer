import { Injectable } from '@angular/core';

import {
  Observable,
  Subject,
} from 'rxjs';

import {
  playSound,
  SoundType,
  SoundContext,
  MidiOscOptions,
} from './sound-types';

const p5 = require('p5');
const p5sound = require('p5sound');

export interface IP5 {
  Env: (envelopeOptions: Array<number>) => void;
  SinOsc: () => void;
  midiToFreq: (number) => number;
  getAudioContext: () => AudioContext;
};

@Injectable()
export class SoundService {
  private p5: IP5;
  private mainGainNode = new p5.Gain();

  constructor() {
    this.p5 = new p5(p => {
      p.setup = (arg) => {
        p.createCanvas(100, 100);
      };
    });
    this.mainGainNode.connect();
  }

  public playMidiNote(
    note: number,
    time: number = 0,
    gainNode: any = this.mainGainNode,
    attackLevel: number = 1.0,
    releaseLevel: number = 0,
    attackTime: number = 0.001,
    decayTime: number = 0.2,
    susPercent: number = 0.2,
    releaseTime: number = 0.5) {

    playSound({
      time: time,
      type: SoundType.MIDI_OSC,
      gain: this.mainGainNode,
      p5: this.p5,
      data: {
        note: note,
        attackLevel,
        releaseLevel,
        attackTime,
        decayTime,
        susPercent,
        releaseTime,
      },
    });
  }

  public setAmplitude(amplitude) {
    this.mainGainNode.amp(amplitude, 0.1);
  }

  public playSequence(
    getNextSoundsAfterBeat: (lastScheduledBeat) => any,
    bpm: number = 120,
    beatOffset: number = 0) {

    let startTime;
    const gain = new p5.Gain();
    gain.connect(this.mainGainNode);

    const progress = new Subject();

    let stopped = false;
    const stop = (reset: boolean) => {
      if (reset) {
        progress.next(0);
      }
      // console.info('stop');
      gain.amp(0, 0.1);
      setTimeout(() => {
        gain.disconnect();
        gain.dispose();
      }, 100);

      stopped = true;
    };

    const currentPosition = () => {
      return Math.max(beatsElapsed, 0);
    };

    let beatsElapsed = beatOffset;
    let lastScheduledBeat = beatOffset - 0.02;

    let sounds = getNextSoundsAfterBeat(lastScheduledBeat);

    const beatsToSecondsFactor = bpm / 60;

    const retriggerTimingFrame = () => {
      if (!stopped) {
        requestAnimationFrame(() => {
          startTime = startTime
            || this.p5.getAudioContext().currentTime + 0.005;

          const elapsedTime = this.p5.getAudioContext().currentTime - startTime;
          beatsElapsed = elapsedTime * beatsToSecondsFactor + beatOffset;
          // notify progress
          if (!stopped && beatsElapsed >= 0) {
            progress.next(beatsElapsed);
          }

          while (sounds.length && lastScheduledBeat < beatsElapsed
            + 0.2 * beatsToSecondsFactor) {

            // queue this batch of sounds
            sounds.map(sound => {
              const noteBeatOffset = sound.time - beatsElapsed;
              if (noteBeatOffset > 0) {
                const timeOffset = noteBeatOffset / beatsToSecondsFactor;
                playSound({
                  time: timeOffset,
                  type: SoundType.MIDI_OSC,
                  gain: gain,
                  p5: this.p5,
                  data: sound,
                });
              }
            });

            // progress to the next beat position
            lastScheduledBeat = sounds[0].time;
            sounds = getNextSoundsAfterBeat(lastScheduledBeat);

          }

          retriggerTimingFrame();
        });
      }
    };

    retriggerTimingFrame();

    return { stop, progress, currentPosition };
  }
}
