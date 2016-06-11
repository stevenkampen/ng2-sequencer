import { SequencerActions } from '../actions/sequencer';
import { SessionActions } from '../actions/session';
import { Map, fromJS } from 'immutable';

const INITIAL_STATE = fromJS({
  looping: false,
  playing: false,
  channelCount: 2, // independently configurable/customizable channels
  // tempo: 120, // bpm
  measureCount: 3, // number of bars
  soundData: {
    // 12 notes - [C, C#, D, D#, E, F, F#, G, G#, A, A#, B]
    // 11 Octaves
    // 12 * octave + scaleIndex
    'C': 0,
    'C#': 1,
    'D': 2,
    'D#': 3,
    'E': 4,
    'F': 5,
    'F#': 6,
    'G': 7,
    'G#': 8,
    'A': 9,
    'A#': 10,
    'B': 11,
  },
  sequenceData: [
    [ // channel 1
      [ // channel 1 - measure 1
        '7_G',
        '7_E',
        '5_F',
        '5_F',
      ],
      [ // channel 1 - measure 2
        '9_A#',
        '9_B',
        '6_A',
        '6_B',
      ],
      [ // channel 1 - measure 3
        '9_A#',
        '10_B',
        '4_A',
        '4_B',
      ],
    ],
    [ // channel 2
      [ // channel 2 - measure 1
        null,
        '4_E',
        null,
        '4_F#',
      ],
      [ // channel 2 - measure 2
        '4_C',
        null,
        '4_C#',
        null,
      ],
      [ // channel 2 - measure 3
        '4_C#',
        '3_C#',
        '4_C#',
        '3_C#',
      ],
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
