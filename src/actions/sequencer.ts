import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../reducers';

@Injectable()
export class SequencerActions {
  static PAUSE = 'PAUSE';
  static PLAY = 'PLAY';
  static ADD_MEASURE = 'ADD_MEASURE';
  static REMOVE_MEASURE = 'REMOVE_MEASURE';
  static ADD_CHANNEL = 'ADD_CHANNEL';
  static REMOVE_CHANNEL = 'REMOVE_CHANNEL';
  static TOGGLE_LOOPING = 'TOGGLE_LOOPING';

  constructor(private ngRedux: NgRedux<IAppState>) {}

  play() {
    this.ngRedux.dispatch({ type: SequencerActions.PLAY });
  }

  pause() {
    this.ngRedux.dispatch({ type: SequencerActions.PAUSE });
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
