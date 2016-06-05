import { combineReducers } from 'redux';
import { ICounter, counterReducer } from './counter';
import { ISession, sessionReducer } from './session';
import { ISequencer, sequencerReducer } from './sequencer';

export interface IAppState {
  counter?: ICounter;
  session?: ISession;
  sequencer?: ISequencer;
};

export default combineReducers<IAppState>({
  counter: counterReducer,
  session: sessionReducer,
  sequencer: sequencerReducer,
});
