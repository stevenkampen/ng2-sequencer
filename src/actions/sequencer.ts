import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../reducers';
import { SoundService } from '../services/sound';
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

  constructor(private ngRedux: NgRedux<IAppState>,
              private soundService: SoundService) {}

  play() {
    this.soundService.setAmplitude(
      this.ngRedux.getState().sequencer.get('amplitude'));

    const currentPosition =
      this.ngRedux.getState().sequencer.get('currentPosition');

    const playingContext = this.soundService.playSequence(
      lastScheduledBeat => {
        // console.time('findNote');

        const sequenceData
          = this.ngRedux.getState().sequencer.get('compiledSequenceData');

        // console.log('Looking for time:%s in items',
        //   lastScheduledBeat,
        //   sequenceData.toJS());

        let searchRangeStart = 0;
        let searchRangeEnd = sequenceData.size - 1;
        let i = Math.floor(searchRangeStart + searchRangeEnd / 2);
        // console.log('i:', i);
        const sounds = [];

        const addSound = (sound) => {
          sounds.push(sound.toJS());
        };
        while (true) {
          const valueAt = sequenceData.get(i);
          if (valueAt.get('time') <= lastScheduledBeat) {
            if (i === sequenceData.size - 1) {
              break;
            }
            // this sound is earlier than our current beat
            searchRangeStart = i + 1;
            i = Math.floor(searchRangeStart +
              (searchRangeEnd - searchRangeStart) / 2);
            // console.log('i:', i);
          } else if (valueAt.get('time') > lastScheduledBeat
            && (i === 0 || sequenceData.get(i - 1).get('time') <= lastScheduledBeat)) {
            // this is the time value we're looking for... 
            addSound(valueAt);
            // check for subsequent sounds with the same time value
            while (sequenceData.get(i + 1) && 
              sequenceData.get(i + 1).get('time') === valueAt.get('time')) {
              addSound(sequenceData.get(i + 1));
              i++;
            }
            break;
          } else if (valueAt.get('time') > lastScheduledBeat) {
            // this sound is later than our current beat
            searchRangeEnd = i - 1;
            i = Math.floor(searchRangeStart +
              (searchRangeEnd - searchRangeStart) / 2);
            // console.log('i:', i);
          }
        }
        // console.debug('sounds', sounds);
        // console.timeEnd('findNote');
        return sounds;

      }, this.ngRedux.getState().sequencer.get('bpm'), currentPosition);

    playingContext.progress.subscribe(elapsedBeats => {
      if (elapsedBeats >=
        this.ngRedux.getState().sequencer.get('sequenceLength')) {
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
    const sequenceLength = this.ngRedux.getState().sequencer.get('sequenceLength');
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
    const sequenceLength = this.ngRedux.getState().sequencer.get('sequenceLength');

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

  selectSound(sound: any) {
    this.ngRedux.dispatch({
      type: SequencerActions.SELECT_SOUND,
      sound: sound,
    });
  }
}
