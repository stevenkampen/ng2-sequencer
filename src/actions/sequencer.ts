import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../reducers';
import { SoundService } from '../services/sound';

@Injectable()
export class SequencerActions {
  static PAUSE = 'PAUSE';
  static PLAY = 'PLAY';
  static ADD_MEASURE = 'ADD_MEASURE';
  static REMOVE_MEASURE = 'REMOVE_MEASURE';
  static ADD_CHANNEL = 'ADD_CHANNEL';
  static REMOVE_CHANNEL = 'REMOVE_CHANNEL';
  static TOGGLE_LOOPING = 'TOGGLE_LOOPING';

  constructor(private ngRedux: NgRedux<IAppState>,
              private soundService: SoundService) {}

  play() {
    this.ngRedux.dispatch({ type: SequencerActions.PLAY });
    this.soundService.playSequence([0.75, 1.5, 1.75, 2.25]);
  }

  playMidiNote(note: number) {
    this.soundService.playNote(note);
  }

  pause() {
    this.ngRedux.dispatch({ type: SequencerActions.PAUSE });
    this.soundService.playSequence([0.5, 0.75, 0.80, 1.2, 1.5, 1.75, 2.25]);
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
