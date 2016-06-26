import { SequencerActions } from '../actions/sequencer';
import { List, Map, fromJS } from 'immutable';

const DUMMY_TEMPO = 120;

const DUMMY_SEQUENCE_DATA = List([
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [
    0.25,
    0.75,
    1.00,
    1.25,
    1.50,
    1.75,
  ],
  [
    0.50,
    1.00,
    1.75,
  ],
  [
  ],
  [
  ],
  [
  ],
  [
  ],
  [
  ],
  [
  ],
  [
  ],
  [
  ],
  [
  ],
  [
  ],
  [
  ],
  [
  ],
  [
  ],
  [
  ],
  [
  ],
  [
  ],
  [
  ],
  [
  ],
  [
  ],
  [
  ],
  [
    0.55,
    1.60,
    1.90,
    3.00,
  ],
  [
    0.87,
    2.54,
    3.00,
  ],
  [],
  [],
  [],
  [],
  [],
  [],
]);

const NOTES = fromJS([
  { header: 'C', number: 60 },
  { header: 'C#', number: 61 },
  { header: 'D', number: 62 },
  { header: 'D#', number: 63 },
  { header: 'E', number: 64 },
  { header: 'F', number: 65 },
  { header: 'F#', number: 66 },
  { header: 'G', number: 67 },
  { header: 'G#', number: 68 },
  { header: 'A', number: 69 },
  { header: 'A#', number: 70 },
  { header: 'B', number: 71 }, 
  { header: 'C', number: 72 },
  { header: 'C#', number: 73 },
  { header: 'D', number: 74 },
  { header: 'D#', number: 75 },
  { header: 'E', number: 76 },
  { header: 'F', number: 77 },
  { header: 'F#', number: 78 },
  { header: 'G', number: 79 },
  { header: 'G#', number: 80 },
  { header: 'A', number: 81 },
  { header: 'A#', number: 82 },
  { header: 'B', number: 83 },
  { header: 'C', number: 84 },
  { header: 'C#', number: 85 },
  { header: 'D', number: 86 },
  { header: 'D#', number: 87 },
  { header: 'E', number: 88 },
  { header: 'F', number: 89 },
  { header: 'F#', number: 90 },
  { header: 'G', number: 91 },
  { header: 'G#', number: 92 },
  { header: 'A', number: 93 },
  { header: 'A#', number: 94 },
  { header: 'B', number: 95 },
  { header: 'C', number: 96 },
  { header: 'C#', number: 97 },
  { header: 'D', number: 98 },
  { header: 'D#', number: 99 },
  { header: 'E', number: 100 },
  { header: 'F', number: 101 },
  { header: 'F#', number: 102 },
  { header: 'G', number: 103 },
  { header: 'G#', number: 104 },
  { header: 'A', number: 105 },
  { header: 'A#', number: 106 },
  { header: 'B', number: 107 },
]);

interface ISound {
  time: number;
  sound: number;
};

const DUMMY_SEQUENCE_DATA_COMPILED = DUMMY_SEQUENCE_DATA
  .flatMap((value, i) => value.map(timeValue => {
    return { note: NOTES.getIn([i, 'number']), time: timeValue };
  }))
  .sortBy((sound: ISound) => sound.time);

const DUMMY_TRACK_LENGTH = DUMMY_SEQUENCE_DATA_COMPILED
  .reduce((r: number, value: ISound, i: number) => {
    const nextValue = Math.max(r, value.time);
    const end = i === DUMMY_SEQUENCE_DATA_COMPILED.size - 1;
    return end ? Math.ceil(nextValue / 2) * 2 + 0.25 : nextValue;
  }, 0);

const INITIAL_STATE = fromJS({
  looping: false,
  playing: null,
  currentPosition: 0, // in beats
  channelCount: NOTES.size, // different sounds
  bpm: DUMMY_TEMPO, // bpm
  measureCount: 3, // number of bars
  channelHeaders: NOTES.map(v => v.get('header')),
  channelData: DUMMY_SEQUENCE_DATA,
  compiledSequenceData: DUMMY_SEQUENCE_DATA_COMPILED,
  sequenceLength: DUMMY_TRACK_LENGTH,
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
});

export type ISequencer = Map<string, any>;

export function sequencerReducer(
  state: ISequencer = INITIAL_STATE,
  action) {

  switch (action.type) {

  case SequencerActions.PLAY:
    return state.update('playing', (value) => action.payload);

  case SequencerActions.STOP:
    return state.update('playing', (value) => null)
                .update('currentPosition', (value) => action.position);

  case SequencerActions.TOGGLE_LOOPING:
    return state.update('looping', (value) => !value);

  case SequencerActions.UPDATE_CURRENT_POSITION:
      return state.update('currentPosition', (value) => action.position);

  case SequencerActions.ADD_CHANNEL:
    return state.update('channelCount', (value) => value + 1);

  case SequencerActions.REMOVE_CHANNEL:
      return state.update('channelCount', (value) => value - 1);

  default:
    return state;
  }
}
