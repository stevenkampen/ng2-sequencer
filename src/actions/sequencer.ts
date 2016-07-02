import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../reducers';

import {
  SoundService,
  SequenceService,
} from '../services';

import {
  Observable,
  Subscription,
  Subscriber,
  Subject,
} from 'rxjs';

@Injectable()
export class SequencerActions {
  static STOP = 'STOP';
  static PLAY = 'PLAY';
  static ADD_CHANNEL = 'ADD_CHANNEL';
  static REMOVE_CHANNEL = 'REMOVE_CHANNEL';
  static TOGGLE_LOOPING = 'TOGGLE_LOOPING';
  static UPDATE_CURRENT_POSITION = 'UPDATE_CURRENT_POSITION';
  static UPDATE_AMPLITUDE = 'UPDATE_AMPLITUDE';
  static SELECT_SOUND = 'SELECT_SOUND';
  static REMOVE_SOUND = 'REMOVE_SOUND';
  static UPDATE_SOUND_TIME = 'UPDATE_SOUND_TIME';
  static ADD_SOUND = 'ADD_SOUND';

  constructor(private ngRedux: NgRedux<IAppState>,
              private soundService: SoundService,
              private sequenceService: SequenceService) { }

  play() {
    const playingContext =
      this.sequenceService.playSequence(this.ngRedux.getState);

    playingContext.progress.subscribe(elapsedBeats => {
      if (elapsedBeats >= this.ngRedux.getState().sequencer.getIn(
        ['soundData', 'sequenceLength'])) {
          this.stop();
          if (this.ngRedux.getState().sequencer.get('looping')) {
            this.play();
          }
        }
    });

    // update redux state every 500ms with the current position
    playingContext.progress.throttleTime(200).subscribe(
      this.updateCurrentPosition.bind(this));

    this.ngRedux.dispatch({
      type: SequencerActions.PLAY,
      payload: playingContext,
    });
  }

  playMidiNote(note: number) {
    this.soundService.setAmplitude(
      this.ngRedux.getState().sequencer.get('amplitude'));
    this.soundService.playMidiNote(note);
  }

  updateAmplitude(amplitude: number) {
    this.soundService.setAmplitude(amplitude);
    this.ngRedux.dispatch({
      type: SequencerActions.UPDATE_AMPLITUDE,
      amplitude,
    });
  }

  changePosition(delta) {
    const playing = this.ngRedux.getState().sequencer.get('playing');
    const sequenceLength =
      this.ngRedux.getState().sequencer.getIn(['soundData', 'sequenceLength']);
    const currentPosition = playing ? playing.currentPosition() :
      this.ngRedux.getState().sequencer.get('currentPosition');
    const newPosition = currentPosition + delta;

    if (playing) {
      this.stop();
    }

    this.updateCurrentPosition(newPosition >=
        sequenceLength ? 0 : Math.max(0, newPosition));

    if (playing) {
      this.play();
    }
  }

  pause() {
    this.stop(false);
  }

  stop(reset: boolean = true) {
    const playing = this.ngRedux.getState().sequencer.get('playing');
    const sequenceLength =
      this.ngRedux.getState().sequencer.getIn(['soundData', 'sequenceLength']);

    const lastBeatTime = !playing ? 
      this.ngRedux.getState().sequencer.get('currentPosition') : 
        playing.currentPosition() > sequenceLength ? 0 :
        playing.currentPosition();

    this.ngRedux.dispatch({
      type: SequencerActions.STOP,
      position: reset ? 0 : lastBeatTime,
    });

    if (playing) {
      playing.stop();
    }
  }

  updateCurrentPosition(position) {
    this.ngRedux.dispatch({
      type: SequencerActions.UPDATE_CURRENT_POSITION,
      position: position,
    });
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

  selectSound(channelIndex: number, soundIndex: number) {
    const selectedSound =
      this.ngRedux.getState().sequencer.get('selectedSound');
    if (!selectedSound ||
      selectedSound.get(0) !== channelIndex ||
      selectedSound.get(1) !== soundIndex) {
      this.ngRedux.dispatch({
        type: SequencerActions.SELECT_SOUND,
        channelIndex,
        soundIndex,
      });
    }
  }

  addSound(channelIndex: number, time: number, data: any = {}) {
    const newSoundIndex =
      this.sequenceService.findHighestIndexWithoutExceedingTime(time,
        this.ngRedux.getState().sequencer.getIn(['soundData', 'channelData'])
          .get(channelIndex)) + 1;

    data.time = time;

    this.ngRedux.dispatch({
      type: SequencerActions.ADD_SOUND,
      channelIndex,
      newSoundIndex,
      sound: data,
    });
  }

  updateSelectedSoundTime(time: number) {
    if (this.ngRedux.getState().sequencer.get('selectedSound')) {
      const [channelIndex, soundIndex] = this.ngRedux.getState().sequencer
        .get('selectedSound').toJS();

      const newSoundIndex =
        this.sequenceService.findHighestIndexWithoutExceedingTime(time,
          this.ngRedux.getState().sequencer
            .getIn(['soundData', 'channelData', channelIndex])
            .delete(soundIndex)) + 1;

      this.ngRedux.dispatch({
        type: SequencerActions.UPDATE_SOUND_TIME,
        channelIndex,
        soundIndex,
        time,
        newSoundIndex,
      });
    }
  }

  removeSelectedSound() {
    const selectedSound =
      this.ngRedux.getState().sequencer.get('selectedSound');

    if (selectedSound) {
      this.removeSound(selectedSound.get(0), selectedSound.get(1));
    }
  }

  removeSound(channelIndex: number, soundIndex: number) {
    this.ngRedux.dispatch({
      type: SequencerActions.REMOVE_SOUND,
      channelIndex,
      soundIndex,
    });
  }
}
