import { SequencerActions } from '../actions/sequencer';
import { Map, fromJS } from 'immutable';

const DUMMY_TEMPO = 120;

const DUMMY_SEQUENCE_DATA = fromJS([
  [
    { time: 1 },
  ],
  [
    { time: 2 },
  ],
  [
    { time: 3 },
  ],
  [],
  [
    { time: 1 },
    { time: 4 },
  ],
  [
    { time: 2 },
  ],
  [
    { time: 3 },
  ],
  [
    { time: 1 },
    { time: 4 },
  ],
  [
    { time: 2 },
  ],
  [
    { time: 3 },
  ],
  [],
  [
    { time: 4 },
  ],
  [
    { time: 5 },
  ],
  [
    { time: 6 },
  ],
  [
    { time: 7 },
  ],
  [],
  [
    { time: 5 },
    { time: 8 },
  ],
  [
    { time: 6 },
  ],
  [
    { time: 7 },
  ],
  [
    { time: 5 },
    { time: 8 },
  ],
  [
    { time: 6 },
  ],
  [
    { time: 7 },
  ],
  [],
  [
    { time: 8 },
  ],
  [
    { time: 9 },
  ],
  [
    { time: 10 },
  ],
  [
    { time: 11 },
  ],
  [],
  [
    { time: 12 },
    { time: 9 },
  ],
  [
    { time: 10 },
  ],
  [
    { time: 11 },
  ],
  [
    { time: 12 },
    { time: 9 },
  ],
  [
    { time: 10 },
  ],
  [
    { time: 11 },
  ],
  [],
  [
    { time: 12 },
  ],
]);

const NOTES_DATA = fromJS([
  { header: 'C', data: { note: 48 }},
  { header: 'C#', data: { note: 49 }},
  { header: 'D', data: { note: 50 }},
  { header: 'D#', data: { note: 51 }},
  { header: 'E', data: { note: 52 }},
  { header: 'F', data: { note: 53 }},
  { header: 'F#', data: { note: 54 }},
  { header: 'G', data: { note: 55 }},
  { header: 'G#', data: { note: 56 }},
  { header: 'A', data: { note: 57 }},
  { header: 'A#', data: { note: 58 }},
  { header: 'B', data: { note: 59 }}, 
  { header: 'C', data: { note: 60 }},
  { header: 'C#', data: { note: 61 }},
  { header: 'D', data: { note: 62 }},
  { header: 'D#', data: { note: 63 }},
  { header: 'E', data: { note: 64 }},
  { header: 'F', data: { note: 65 }},
  { header: 'F#', data: { note: 66 }},
  { header: 'G', data: { note: 67 }},
  { header: 'G#', data: { note: 68 }},
  { header: 'A', data: { note: 69 }},
  { header: 'A#', data: { note: 70 }},
  { header: 'B', data: { note: 71 }}, 
  { header: 'C', data: { note: 72 }},
  { header: 'C#', data: { note: 73 }},
  { header: 'D', data: { note: 74 }},
  { header: 'D#', data: { note: 75 }},
  { header: 'E', data: { note: 76 }},
  { header: 'F', data: { note: 77 }},
  { header: 'F#', data: { note: 78 }},
  { header: 'G', data: { note: 79 }},
  { header: 'G#', data: { note: 80 }},
  { header: 'A', data: { note: 81 }},
  { header: 'A#', data: { note: 82 }},
  { header: 'B', data: { note: 83 }},
  { header: 'C', data: { note: 84 }},
  { header: 'C#', data: { note: 85 }},
  { header: 'D', data: { note: 86 }},
  { header: 'D#', data: { note: 87 }},
  { header: 'E', data: { note: 88 }},
  { header: 'F', data: { note: 89 }},
  { header: 'F#', data: { note: 90 }},
  { header: 'G', data: { note: 91 }},
  { header: 'G#', data: { note: 92 }},
  { header: 'A', data: { note: 93 }},
  { header: 'A#', data: { note: 94 }},
  { header: 'B', data: { note: 95 }},
  { header: 'C', data: { note: 96 }},
  { header: 'C#', data: { note: 97 }},
  { header: 'D', data: { note: 98 }},
  { header: 'D#', data: { note: 99 }},
  { header: 'E', data: { note: 100 }},
  { header: 'F', data: { note: 101 }},
  { header: 'F#', data: { note: 102 }},
  { header: 'G', data: { note: 103 }},
  { header: 'G#', data: { note: 104 }},
  { header: 'A', data: { note: 105 }},
  { header: 'A#', data: { note: 106 }},
  { header: 'B', data: { note: 107 }},
]);

const INITIAL_SOUND_MAPPING = {};

let trackId = 0;

// array of channels, which are arrays of sounds
const INITIAL_SEQUENCE_DATA = DUMMY_SEQUENCE_DATA.map((channel, channelIndex) => {
  return channel.map(value => {
    trackId++;
    INITIAL_SOUND_MAPPING[trackId] = value.setIn(['note'],
      NOTES_DATA.getIn([channelIndex, 'data', 'note']));
    return value.setIn(['id'], trackId);
  });
});

// single ordered array of all sounds
const DUMMY_SEQUENCE_DATA_COMPILED = INITIAL_SEQUENCE_DATA
  .flatMap(channel => channel.map(value => {
    return fromJS({
      id: value.get('id'),
      time: value.get('time'),
    });
  }))
  .sortBy(sound => sound.get('time'));

const DUMMY_TRACK_LENGTH = Math.ceil(DUMMY_SEQUENCE_DATA_COMPILED.getIn(
  [DUMMY_SEQUENCE_DATA_COMPILED.size - 1]).get('time') + 1);

const INITIAL_STATE = fromJS({
  looping: false,
  playing: null,
  amplitude: 0.5,
  currentPosition: 0, // in beats
  bpm: DUMMY_TEMPO, // bpm
  channelHeaders: NOTES_DATA.map(v => v.get('header')),
  channelData: DUMMY_SEQUENCE_DATA,
  compiledSequenceData: DUMMY_SEQUENCE_DATA_COMPILED,
  sequenceLength: DUMMY_TRACK_LENGTH,
  channels: NOTES_DATA,
  soundMapping: INITIAL_SOUND_MAPPING,
  selectedSound: null,
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

  case SequencerActions.UPDATE_AMPLITUDE:
      return state.update('amplitude', (value) => action.amplitude);

  case SequencerActions.ADD_CHANNEL:
    return state.update('channelCount', (value) => value + 1);

  case SequencerActions.REMOVE_CHANNEL:
      return state.update('channelCount', (value) => value - 1);

  case SequencerActions.SELECT_SOUND:
    return state.update('selectedSound', (value) => action.sound);

  default:
    return state;
  }
}
