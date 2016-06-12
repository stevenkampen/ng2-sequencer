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
      <rio-button (click)="!playing ? play() : pause()">
        <i class="fa"
          [ngClass]="{'fa-pause': playing, 'fa-play': !playing }">
        </i>
      </rio-button>
      <rio-button (click)="toggleLooping()">
        <i class="fa fa-repeat"
          [ngClass]="{'fa-spin': looping }">
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
  @Input() pause: () => void;
  @Input() toggleLooping: () => void;

  constructor() {
  }
};
