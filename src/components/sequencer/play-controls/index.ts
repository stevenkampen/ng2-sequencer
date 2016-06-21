import { Component, Input } from '@angular/core';
import { RioButton } from '../../button';
import {
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'play-controls',
  template: `
    <div class="flex control-bar">
      <rio-button (click)="!playing ? play() : stop()">
        <i class="fa"
          [ngClass]="{'fa-stop': playing, 'fa-play': !playing }">
        </i>
      </rio-button>
    </div>
  `,
  encapsulation: ViewEncapsulation.Emulated,
  styles: [`
    .control-bar {
      padding: .5em;
    }
    rio-button { margin-right: .3em; }
  `],
  directives: [RioButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PlayControls {
  @Input() playing: boolean = false;
  @Input() looping: boolean = false;
  @Input() play: () => void;
  @Input() stop: () => void;
  @Input() toggleLooping: () => void;

  constructor() {
  }
};
