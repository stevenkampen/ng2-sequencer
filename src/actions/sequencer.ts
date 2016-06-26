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

  constructor(private ngRedux: NgRedux<IAppState>,
              private soundService: SoundService) {}

  play(fromPosition: number = 0) {
    const { stop, progress } = this.soundService.playSequence(
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
            i = Math.floor(searchRangeStart
              + (searchRangeEnd - searchRangeStart) / 2);
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
            i = Math.floor(searchRangeStart
              + (searchRangeEnd - searchRangeStart) / 2);
            // console.log('i:', i);
          }
        }
        // console.debug('notes', notes);
        // console.timeEnd('findNote');
        return notes;

      }, this.ngRedux.getState().sequencer.get('bpm'), fromPosition);

    progress.subscribe(elapsedBeats => {
      if (elapsedBeats >=
        this.ngRedux.getState().sequencer.get('sequenceLength')) {
        stop();
        this.stop();
        if (this.ngRedux.getState().sequencer.get('looping')) {
          this.play();
        }
      }
    });

    this.ngRedux.dispatch({
      type: SequencerActions.PLAY,
      payload: {
        stop,
        progress,
      }
    });
  }

  playMidiNote(note: number) {
    this.soundService.playNote(note);
  }

  stop() {
    const playing = this.ngRedux.getState().sequencer.get('playing');
    if (playing) {
      playing.stop();
      this.ngRedux.dispatch({ type: SequencerActions.STOP });
    }
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
