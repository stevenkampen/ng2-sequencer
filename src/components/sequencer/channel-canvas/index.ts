import {
  Component,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';

import { RioButton } from '../../button';

@Component({
  selector: 'channel-canvas',
  template: `
    <div class="flex">
      <div *ngFor="let measure of data" style="width:33%;background:#333;">
        <div *ngFor="let channelSegment of measure">
          <div *ngFor="let note of channelSegment" 
            style="width:25%;float:left;border-bottom:1px solid white;
              border-left:1px solid white;text-align:center;color:white;">
            {{ note }}
          </div>
        </div>
      </div>
    </div>
  `,
  directives: [RioButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ChannelCanvas {
  @Input() channelCount: number = 0;
  @Input() measureCount: number = 0;
  @Input() data: Array<Array<number>> = [];

  constructor() {
  }
};
