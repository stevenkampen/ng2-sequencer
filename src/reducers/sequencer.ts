import { SequencerActions } from '../actions/sequencer';
import { SessionActions } from '../actions/session';
import { Map, fromJS } from 'immutable';

const INITIAL_STATE = fromJS({
  looping: false,
  playing: false,
  channelCount: 2, // independently configurable/customizable channels
  // tempo: 120, // bpm
  measureCount: 3, // number of bars
  data: [
    [ // measure 1
      [
        1,
        2,
        3,
        4,
      ], // channel 1
      [
        0,
        0,
        1,
        2,
      ], // channel 2
    ],
    [ // measure 2
      [
        1,
        2,
        3,
        4,
      ], // channel 1
      [
        0,
        0,
        0,
        0,
      ], // channel 2
    ],
    [  // measure 3
      [
        1,
        2,
        3,
        4,
      ], // channel 1
      [
        0,
        0,
        1,
        2,
      ], // channel 2
    ],
  ],
});

export type ISequencer = Map<string, any>;

export function sequencerReducer(
  state: ISequencer = INITIAL_STATE,
  action = { type: '' }) {

  switch (action.type) {

  case SequencerActions.PLAY:
    return state.update('playing', (value) => true);

  case SequencerActions.PAUSE:
    return state.update('playing', (value) => false);

  case SequencerActions.TOGGLE_LOOPING:
    return state.update('looping', (value) => !value);

  case SequencerActions.ADD_MEASURE:
    return state.update('measureCount', (value) => value + 1);

  case SequencerActions.REMOVE_MEASURE:
    return state.update('measureCount', (value) => value - 1);

  case SequencerActions.ADD_CHANNEL:
    return state.update('channelCount', (value) => value + 1);

  case SequencerActions.REMOVE_CHANNEL:
      return state.update('channelCount', (value) => value - 1);

  case SessionActions.LOGOUT_USER:
    return state.merge(INITIAL_STATE);

  default:
    return state;
  }
}
