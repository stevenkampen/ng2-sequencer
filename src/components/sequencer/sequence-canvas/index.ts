import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ElementRef,
  ViewChild,
} from '@angular/core';

import {
  NgStyle,
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
          [ngStyle]="{'margin-left': '-' + calcOffset(currentPosition) + 'px'}">
          <div *ngFor="let channelIndex of channelRange | async; let odd = odd"
            class="channel"
            [ngClass]="{ odd: odd }">
            <div *ngFor="let noteTiming of channelData.get(channelIndex)"
              [style.left]="noteTiming * 100 + 'px'"
              class="note">
            </div>
          </div>
          <div class="end-guide"
            [style.left]="calcOffset(sequenceLength) + 'px'"></div>
        </div>
      </div>
    </div>
  `,
  pipes: [ AsyncPipe ],
  directives: [NgStyle],
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
      height: 14px;
      color: #CECECE;
      position: relative;
      background-color: rgba(0, 0, 0, .3);
    }
    .sequence-panel .end-guide {
      position: absolute;
      top: 0;
      width: 1px;
      background: red;
      height: 100%;
    }
    .sequence-board .channel.odd {
      background-color: rgba(0, 0, 0, .5);
    }
    .sequence-panel {
      position: relative;
    }
    ul.channel-headers {
      width: 3em;  
      margin: 0;
    }
    ul.channel-headers li {
      font-size: .6em;
      font-weight: bold;
      height: 14px;
      background: #CECECE;
      padding: 0 .4em;
    }
    ul.channel-headers li.odd {
      background: #999;
    }
    .note {
      position: absolute;
      top: 3px;
      margin-left: -4px;
      height: 8px;
      width: 8px;
      background: red;
      border-radius: 4px;
    }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SequenceCanvas implements OnChanges {
  @Input() channelRange: Observable<Array<number>>;
  @Input() currentPosition: number;
  @Input() channelHeaders: Array<string>;
  @Input() channelData: Array<Array<any>>;
  @Input() playing: any;
  @Input() sequenceLength: number;
  @Input() bpm: number;
  @Input() playMidiNote: (number) => void;

  @ViewChild('sequencePanel') elem: ElementRef;

  constructor() {}

  private calcOffset(beatsElapsed: number) {
    const elapsedPercentage = beatsElapsed / this.sequenceLength;
    const offset = this.sequenceLength * 50 * elapsedPercentage * 2;
    return offset;
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {

    let chng = changes['playing'];

    if (chng && chng.currentValue && chng.previousValue !== chng.currentValue) {
      this.playing.progress.subscribe(beatsElapsed => {
        if (beatsElapsed < this.sequenceLength) {
          this.elem.nativeElement.style.marginLeft
            = `-${this.calcOffset(beatsElapsed)}px`;
        }
      });
    }

  }
};
