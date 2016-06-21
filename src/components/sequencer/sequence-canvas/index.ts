import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ElementRef,
  ViewChild,
} from '@angular/core';

import {
  AsyncPipe,
} from '@angular/common';

import {
  OnChanges,
  SimpleChange,
} from '@angular/core';

import { Map } from 'immutable';
import { Observable } from 'rxjs';

@Component({
  selector: 'sequence-canvas',
  template: `
    <div class="flex outer-wrapper">
      <ul class="flex-none list-reset channel-headers">
        <li *ngFor="let channelIndex of channelRange | async; let odd = odd"
          [ngClass]="{ odd: odd }">
          {{ channelHeaders.get(channelIndex) }}
        </li>
      </ul>
      <div class="sequence-board flex-auto">
        <div #sequencePanel class="sequence-panel"
          [ngStyle]="{ width: sequenceLength * bpm / 60 * 50 + 'px' }">
          <div *ngFor="let channelIndex of channelRange | async; let odd = odd"
            class="channel"
            [ngClass]="{ odd: odd }">
            <div *ngFor="let noteTiming of channelData.get(channelIndex)"
              [style.left]="noteTiming * 100 + 'px'"
              class="note">
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  pipes: [ AsyncPipe ],
  encapsulation: ViewEncapsulation.Emulated,
  styles: [`
    .outer-wrapper {
      height: 100%;
      width: 100%;
      overflow-y: auto;
    }
    .sequence-board {
      overflow: hidden;
    }
    .sequence-board .channel {
      height: 1.5em;
      color: #CECECE;
      position: relative;
      background-color: rgba(0, 0, 0, .3);
    }
    .sequence-board .channel.odd {
      background-color: rgba(0, 0, 0, .7);
    }
    .sequence-panel {
    }
    ul.channel-headers {
      width: 100px;
      text-align: right;
      margin: 0;
    }
    ul.channel-headers li {
      height: 1.5em;
      background: #666;
      padding-right: .5em;
    }
    ul.channel-headers li.odd {
      background: #CECECE;
    }
    .note {
      position: absolute;
      top: 8px;
      margin-left: -5px;
      height: 10px;
      width: 10px;
      background: red;
      border-radius: 5px;
    }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SequenceCanvas implements OnChanges {
  @Input() channelRange: Observable<Array<number>>;
  @Input() measureRange: Observable<Array<number>>;
  @Input() channelHeaders: Array<string>;
  @Input() channelData: Array<Array<any>>;
  @Input() sequenceLength: number;
  @Input() bpm: number;
  @Input() playingObservable: Observable<number>;
  @Input() playMidiNote: (number) => void;
  @Input() currentlyPlayingTimer: Observable<number>;

  @ViewChild('sequencePanel') elem: ElementRef;

  constructor() {}

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {

    let chng = changes['currentlyPlayingTimer'];

    if (chng && chng.currentValue && chng.previousValue !== chng.currentValue) {
      const totalTime = this.sequenceLength * this.bpm / 60;
      this.currentlyPlayingTimer.subscribe(time => {
        const elapsedPercentage = time / totalTime;
        const offset = this.sequenceLength * 50 * elapsedPercentage * 2;
        this.elem.nativeElement.style.marginLeft = `-${offset}px`;
      }, null, () => {
        this.elem.nativeElement.style.marginLeft = `0`;
      });
    }
  }
};
