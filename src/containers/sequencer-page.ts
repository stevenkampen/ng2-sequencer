import {
  Component,
  Inject,
  ApplicationRef,
  ViewEncapsulation,
  OnChanges,
  SimpleChange,
} from '@angular/core';

import { AsyncPipe } from '@angular/common';
import { select } from 'ng2-redux';
import { SequencerActions } from '../actions/sequencer';
import { Subscriber, Observable } from 'rxjs';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../reducers';
import { 
  RioContainer,
  PlayControls,
  SequenceCanvas,
  Keyboard,
} from '../components';

@Component({
  selector: 'sequencer-page',
  providers: [SequencerActions],
  directives: [RioContainer, PlayControls, SequenceCanvas, Keyboard],
  pipes: [AsyncPipe],
  encapsulation: ViewEncapsulation.Emulated,
  styles: [`
  .sequencer-container {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    overflow: hidden;
    background: #999;
  }
  .canvas-container {
    background: #333;
  }
  .controls {
  }
  `],
  template: `
    <div class="flex flex-column sequencer-container">
      <play-controls class="flex-none controls"
        [playing]="playing | async"
        [looping]="looping | async"
        [play]="actions.play.bind(actions, currentPosition | async)"
        [pause]="actions.pause.bind(actions)"
        [stop]="actions.stop.bind(actions)"
        [sequenceLength]="sequenceLength | async"
        [changePosition]="actions.changePosition.bind(actions)"
        [toggleLooping]="actions.toggleLooping.bind(actions)"
        [amplitude]="amplitude | async"
        [updateAmplitude]="actions.updateAmplitude.bind(actions)">
      </play-controls>
      <sequence-canvas class="flex-auto flex flex-column canvas-container"
        [channels]="channels | async"
        [channelData]="channelData | async"
        [bpm]="bpm | async"
        [currentPosition]="currentPosition | async"
        [playing]="playing | async"
        [sequenceLength]="sequenceLength | async"
        [playMidiNote]="actions.playMidiNote.bind(actions)">
      </sequence-canvas>
    </div>
  `
})
export class SequencerPage {
  constructor(private ngRedux: NgRedux<IAppState>, 
    private actions: SequencerActions) {}

  private shouldRepeat = () => {
    return this.ngRedux.getState().sequencer.get('looping');
  };

  @select(n => n.sequencer.get('playing'))
  private playing: Observable<any>;

  @select(n => n.sequencer.get('looping'))
  private looping: Observable<boolean>;

  @select(n => n.sequencer.get('channels'))
  private channels: Observable<Array<any>>;

  @select(n => n.sequencer.get('channelData'))
  private channelData: Observable<any>;

  @select(n => n.sequencer.get('compiledSequenceData'))
  private compiledSequenceData: Observable<any>;

  @select(n => n.sequencer.get('sequenceLength'))
  private sequenceLength: Observable<number>;

  @select(n => n.sequencer.get('amplitude'))
  private amplitude: Observable<number>;

  @select(n => n.sequencer.get('bpm'))
  private bpm: Observable<number>;

  @select(n => n.sequencer.get('currentPosition'))
  private currentPosition: Observable<number>;

}
