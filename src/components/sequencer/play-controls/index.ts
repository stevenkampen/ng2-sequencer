import { Component, Input } from '@angular/core';
import { RioButton } from '../../button';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'play-controls',
  template: `
    <div class="flex">
      <rio-button (click)="!playing ? play() : pause()">
        <template [ngIf]="playing">Pause</template>
        <template [ngIf]="!playing">Play</template>
      </rio-button>
      <rio-button (click)="toggleLooping()">
        <template [ngIf]="looping">Disable Looping</template>
        <template [ngIf]="!looping">Enable Looping</template>
      </rio-button>
    </div>
  `,
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
