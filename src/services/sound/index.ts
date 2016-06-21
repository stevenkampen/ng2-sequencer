import { Injectable, provide } from '@angular/core';

import { Observable } from 'rxjs/Observable';

const p5 = require('p5');
const p5sound = require('p5sound');

interface IP5 {
  Env: (envelopeOptions: Array<number>) => void;
  SinOsc: () => void;
  midiToFreq: (number) => number;
  getAudioContext: () => AudioContext;
};

@Injectable()
export class SoundService {
  private p5: IP5;

  constructor() {
    this.p5 = new p5(p => {
      p.setup = (arg) => {
        p.createCanvas(100, 100);
      };
    });
  }

  public playNote(
    note: number,
    time: number = 0,
    attackLevel: number = 1.0,
    releaseLevel: number = 0,
    attackTime: number = 0.001,
    decayTime: number = 0.2,
    susPercent: number = 0.2,
    releaseTime: number = 0.5) {

    const env = new p5.Env();
    env.setADSR(attackTime, decayTime, susPercent, releaseTime);
    env.setRange(attackLevel, releaseLevel);

    const osc = new p5.SinOsc();
    osc.amp(env);
    osc.start();
    osc.freq(this.p5.midiToFreq(note));
    env.play(osc, time);
  }

  public playSequence(sequence: Array<any>, length: number, 
    shouldRepeat: () => boolean, bpm: number = 120) {

    let startTime = this.p5.getAudioContext().currentTime + 0.005;
    let stopped = false;

    const observable = new Observable<number>(observer => {

      const schedulePeriod = (fromNoteIndex: number = 0) => {
        if (!stopped) {
          while (fromNoteIndex < sequence.length) {

            const timeSinceStart
              = this.p5.getAudioContext().currentTime - startTime;
            const noteTimeInSeconds = sequence[fromNoteIndex].time * bpm / 60;

            if (noteTimeInSeconds > timeSinceStart + 0.200) {
              // next note is more than 200ms away
              break;
            }

            this.playNote(sequence[fromNoteIndex].note,
              noteTimeInSeconds - timeSinceStart);

            fromNoteIndex++;
          }

          const timeElapsed = this.p5.getAudioContext().currentTime - startTime;
          const totalTime = length * bpm / 60;
          const sequenceElapsed = timeElapsed >= totalTime;

          if (sequenceElapsed && shouldRepeat && shouldRepeat()) {
            fromNoteIndex = 0;
            startTime = this.p5.getAudioContext().currentTime;
            requestAnimationFrame(() => schedulePeriod(fromNoteIndex));
            observer.next(this.p5.getAudioContext().currentTime - startTime);
          } else if (sequenceElapsed) {
            // call done
            observer.complete();
          } else {
            requestAnimationFrame(() => schedulePeriod(fromNoteIndex));
            observer.next(this.p5.getAudioContext().currentTime - startTime);
          }
        }
      };

      schedulePeriod();

      return () => {
        stopped = true;
        observer.complete();
      };

    });

    // make it "hot"
    observable.publish();

    return observable;
  }

  public getCanvas() {
    // return this.p5.canvas;
  }
}
