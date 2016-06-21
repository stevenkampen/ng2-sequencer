import { combineReducers } from 'redux';
import { ISequencer, sequencerReducer } from './sequencer';

export interface IAppState {
  sequencer?: ISequencer;
};

export default combineReducers<IAppState>({
  sequencer: sequencerReducer,
});
