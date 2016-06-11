import { Injectable, provide } from '@angular/core';

const p5 = require('p5');
const p5sound = require('p5sound');

interface IP5 {
  Env: (envelopeOptions: Array<number>) => void;
  SinOsc: () => void;
  midiToFreq: (number) => void;
}

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

  public playNote(note: number) {
    //, envelopeOptions: Array<number> = 
    //    [ 0.010, 1.000, 0.000, 1.000, 0.000, 1.000, 0.500 ]) {

    const osc = new p5.SinOsc();
    osc.amp(0);
    osc.start();
    const freq = this.p5.midiToFreq(note);
    console.log('freq:', freq);
    osc.freq(freq);
    osc.amp(0.5, 0.05);
    setTimeout(() => osc.amp(0, 0.2), 100);

    // const env = new this.p5.Env();
    // set attackTime, decayTime, sustainRatio, releaseTime
    // env.setADSR(0.001, 0.1, 0.6, 0.1);
    // env.setRange(1, 0);
    // env.play(osc);

  }

  public getCanvas() {
    // return this.p5.canvas;
  }
}
