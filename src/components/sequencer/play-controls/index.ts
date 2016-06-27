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
      <rio-button (click)="changePosition(-sequenceLength)">
        <i class="fa fa-fast-backward">
        </i>
      </rio-button>
      <rio-button (click)="changePosition(-2)">
        <i class="fa fa-step-backward">
        </i>
      </rio-button>
      <rio-button (click)="playing ? pause() : play()">
        <i class="fa" [ngClass]="{'fa-pause': playing, 'fa-play': !playing }">
        </i>
      </rio-button>
      <rio-button (click)="changePosition(2)">
        <i class="fa fa-step-forward">
        </i>
      </rio-button>
      <rio-button (click)="stop()" [disabled]="currentPosition === 0">
        <i class="fa fa-stop">
        </i>
      </rio-button>
      <rio-button (click)="toggleLooping()">
        <i class="fa fa-refresh" [ngClass]="{'fa-spin': looping }">
        </i>
      </rio-button>
      <input type="range" class="input-range"
        [value]="amplitude * 100"
        (input)="updateAmplitude($event.target.value / 100)">
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
  @Input() pause: () => void;
  @Input() sequenceLength: number;
  @Input() amplitude: number;
  @Input() updateAmplitude: (amplitude: number) => void;
  @Input() changePosition: (beats) => void;
  @Input() currentPosition: number;
  @Input() toggleLooping: () => void;

  constructor() {
  }
};
