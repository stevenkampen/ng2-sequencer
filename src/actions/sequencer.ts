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
  static ADD_MEASURE = 'ADD_MEASURE';
  static REMOVE_MEASURE = 'REMOVE_MEASURE';
  static ADD_CHANNEL = 'ADD_CHANNEL';
  static REMOVE_CHANNEL = 'REMOVE_CHANNEL';
  static TOGGLE_LOOPING = 'TOGGLE_LOOPING';
  static UPDATE_CURRENT_POSITION = 'UPDATE_CURRENT_POSITION';

  constructor(private ngRedux: NgRedux<IAppState>,
              private soundService: SoundService) {}

  play() {
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
        const notes = [];
        while (true) {
          const valueAt = sequenceData.get(i);
          if (valueAt.time <= lastScheduledBeat) {
            if (i === sequenceData.size - 1) {
              break;
            }
            // this note is earlier than our current beat
            searchRangeStart = i + 1;
            i = Math.floor(searchRangeStart +
              (searchRangeEnd - searchRangeStart) / 2);
            // console.log('i:', i);
          } else if (valueAt.time > lastScheduledBeat
            && (i === 0 || sequenceData.get(i - 1).time <= lastScheduledBeat)) {
            // this is the note we're looking for...
            notes.push(valueAt);
            while (sequenceData.get(i + 1) && 
              sequenceData.get(i + 1).time === valueAt.time) {
              notes.push(sequenceData.get(i + 1));
              i++;
            }
            break;
          } else if (valueAt.time > lastScheduledBeat) {
            // this note is later than our current beat
            searchRangeEnd = i - 1;
            i = Math.floor(searchRangeStart +
              (searchRangeEnd - searchRangeStart) / 2);
            // console.log('i:', i);
          }
        }
        // console.debug('notes', notes);
        // console.timeEnd('findNote');
        return notes;

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
    this.soundService.playNote(note);
  }

  changePosition(delta) {
    console.log('Change Position by:', delta);
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

    if (playing) {

      this.ngRedux.dispatch({
        type: SequencerActions.STOP,
        position: reset || playing.currentPosition() >
          sequenceLength ? 0 : playing.currentPosition(),
      });

      playing.stop();
    }
  }

  updateCurrentPosition(position) {
    this.ngRedux.dispatch({
      type: SequencerActions.UPDATE_CURRENT_POSITION,
      position: position,
    });
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
