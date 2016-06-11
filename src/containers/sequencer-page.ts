import { Component, Inject, ApplicationRef } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { bindActionCreators } from 'redux';
import { select } from 'ng2-redux';
import { SequencerActions } from '../actions/sequencer';
import { Observable } from 'rxjs/Observable';
import { 
  RioContainer,
  PlayControls,
  ChannelCanvas,
  Keyboard,
} from '../components';

@Component({
  selector: 'sequencer-page',
  providers: [ SequencerActions ],
  directives: [RioContainer, PlayControls, ChannelCanvas, Keyboard],
  pipes: [ AsyncPipe ],
  template: `
    <rio-container [size]=4 [center]=true>
      <play-controls
      [playing]="playing$ | async"
        [looping]="looping$ | async"
        [play]="actions.play.bind(actions)"
        [pause]="actions.pause.bind(actions)"
        [toggleLooping]="actions.toggleLooping.bind(actions)">
      </play-controls>
      <channel-canvas
        [sequenceData]="sequenceData$ | async"
        [soundData]="soundData$ | async"
        [measureCount]="measureCount$ | async"
        [channelCount]="channelCount$ | async"
        [playMidiNote]="actions.playMidiNote.bind(actions)">
      </channel-canvas>
      <keyboard [playMidiNote]="actions.playMidiNote.bind(actions)">
      </keyboard>
    </rio-container>
  `
})
export class SequencerPage {
  constructor(private actions: SequencerActions) {}

  @select(n => n.sequencer.get('playing'))
  private playing$: Observable<boolean>;

  @select(n => n.sequencer.get('looping'))
  private looping$: Observable<boolean>;

  @select(n => n.sequencer.get('sequenceData'))
  private sequenceData$: Observable<boolean>;

  @select(n => n.sequencer.get('soundData'))
  private soundData$: Observable<boolean>;

  @select(n => n.sequencer.get('measureCount'))
  private measureCount$: Observable<boolean>;

  @select(n => n.sequencer.get('channelCount'))
  private channelCount$: Observable<boolean>;
}
