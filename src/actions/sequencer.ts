import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../reducers';
import { SoundService } from '../services/sound';
import {
  Observable,
  Subscription,
  Subscriber,
} from 'rxjs';

@Injectable()
export class SequencerActions {
  static STOP = 'STOP';
  static PLAY = 'PLAY';
  static ADD_MEASURE = 'ADD_MEASURE';
  static REMOVE_MEASURE = 'REMOVE_MEASURE';
  static ADD_CHANNEL = 'ADD_CHANNEL';
  static REMOVE_CHANNEL = 'REMOVE_CHANNEL';
  static TOGGLE_LOOPING = 'TOGGLE_LOOPING';

  private DUMMY_SEQUENCE = [
    { note: 63, time: 0.10 },
    { note: 73, time: 0.40 },
    { note: 53, time: 0.60 },
    { note: 65, time: 0.90 },
    { note: 66, time: 1.15 },
    { note: 57, time: 1.56 },
    { note: 48, time: 1.75 },
  ];

  constructor(private ngRedux: NgRedux<IAppState>,
              private soundService: SoundService) {}

  play(sequence: any,
       length: number,
       bpm: number,
       shouldRepeat: () => boolean) {

    const tickObservable: Observable<number> = this.soundService.playSequence(
      sequence.toJS(),
      length,
      shouldRepeat,
      bpm);

    const totalTime = length * bpm / 60;

    const subscription: any = tickObservable.subscribe(time => {
      console.info('playing...');
    }, null, () => {
      // "completed"
    });

    // tickObservable.throttleTime(500).subscribe(time => {
    //   console.log('playing...', time);
    // }, null);

    this.ngRedux.dispatch({
      type: SequencerActions.PLAY,
      tickObservable: tickObservable,
      subscription: subscription,
    });
  }

  playMidiNote(note: number) {
    this.soundService.playNote(note);
  }

  stop(subscriber: Subscriber<number>) {
    console.log('Unsubscribing. Should trigger end...');
    subscriber.unsubscribe();
    this.ngRedux.dispatch({ type: SequencerActions.STOP });
  }

  addMeasure() {
    this.ngRedux.dispatch({ type: SequencerActions.ADD_MEASURE });
  }

  removeMeasure() {
    this.ngRedux.dispatch({ type: SequencerActions.REMOVE_MEASURE });
  }

  addChannel() {
    this.ngRedux.dispatch({ type: SequencerActions.ADD_CHANNEL });
  }

  removeChannel() {
    this.ngRedux.dispatch({ type: SequencerActions.REMOVE_CHANNEL });
  }

  toggleLooping() {
    this.ngRedux.dispatch({ type: SequencerActions.TOGGLE_LOOPING });
  }
}
