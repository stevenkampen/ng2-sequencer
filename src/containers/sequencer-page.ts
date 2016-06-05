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
} from '../components';

@Component({
  selector: 'sequencer-page',
  providers: [ SequencerActions ],
  directives: [RioContainer, PlayControls, ChannelCanvas],
  pipes: [ AsyncPipe ],
  template: `
    <rio-container [size]=2 [center]=true>
      <play-controls
      [playing]="playing$ | async"
        [looping]="looping$ | async"
        [play]="actions.play.bind(actions)"
        [pause]="actions.pause.bind(actions)"
        [toggleLooping]="actions.toggleLooping.bind(actions)">
      </play-controls>
      <channel-canvas
        [data]="data$ | async"
        [measureCount]="measureCount$ | async"
        [channelCount]="channelCount$ | async">
      </channel-canvas>
    </rio-container>
  `
})
export class SequencerPage {
  constructor(private actions: SequencerActions) {}

  @select(n => n.sequencer.get('playing'))
  private playing$: Observable<boolean>;
  
  @select(n => n.sequencer.get('looping'))
  private looping$: Observable<boolean>;
  
  @select(n => n.sequencer.get('data'))
  private data$: Observable<boolean>;

  @select(n => n.sequencer.get('measureCount'))
  private measureCount$: Observable<boolean>;

  @select(n => n.sequencer.get('channelCount'))
  private channelCount$: Observable<boolean>;
}
