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

const BEAT_WIDTH: number = 50;

@Component({
  selector: 'sequence-canvas',
  template: `
    <div class="flex outer-wrapper">
      <ul class="flex-none list-reset channel-headers">
        <li *ngFor="let channel of channels; let odd = odd"
        (click)="playMidiNote(channel.get('data').get('note'))"
          [ngClass]="{ odd: odd }">
          {{ channel.get('header') }}
        </li>
      </ul>
      <div class="sequence-board flex-auto">
        <div #sequencePanel class="sequence-panel"
          [ngStyle]="{'margin-left': '-' + calcOffset(currentPosition) + 'px'}">
          <div *ngFor="let channel of channels; let odd = odd; let i = index;"
            class="channel"
            [ngClass]="{ odd: odd }">
            <div *ngFor="let sound of channelData.get(i)"
              [style.left]="sound.time * ${BEAT_WIDTH} + 'px'"
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
      height: 20px;
      color: #CECECE;
      position: relative;
    }
    .sequence-panel .end-guide {
      position: absolute;
      top: 0;
      width: 1px;
      background: red;
      height: 100%;
    }
    .sequence-board .channel.odd {
      background-color: rgba(255, 255, 255, .02);
    }
    .sequence-panel {
      position: relative;
      background-color: #111;
      background-image: -moz-repeating-linear-gradient(90deg, transparent, 
        transparent ${BEAT_WIDTH - 2}px, #191919 ${BEAT_WIDTH}px, 
        #191919 ${BEAT_WIDTH}px);
      background-image: -webkit-repeating-linear-gradient(90deg, transparent, 
        transparent ${BEAT_WIDTH - 2}px, #191919 ${BEAT_WIDTH}px, 
        #191919 ${BEAT_WIDTH}px);
      background-image: -o-repeating-linear-gradient(90deg, transparent,
        transparent ${BEAT_WIDTH - 2}px, #191919 ${BEAT_WIDTH}px,
        #191919 ${BEAT_WIDTH}px);
      background-image: -ms-repeating-linear-gradient(90deg, transparent,
        transparent ${BEAT_WIDTH - 2}px, #191919 ${BEAT_WIDTH}px,
        #191919 ${BEAT_WIDTH}px);
      background-image: repeating-linear-gradient(90deg, transparent,
        transparent ${BEAT_WIDTH - 2}px, #222 ${BEAT_WIDTH}px,
        #222 ${BEAT_WIDTH}px);
    }
    ul.channel-headers {
      width: 3em;  
      margin: 0;
    }
    ul.channel-headers li {
      font-size: .8em;
      line-height: 20px;
      font-weight: bold;
      background: #CECECE;
      padding: 0 .4em;
    }
    ul.channel-headers li.odd {
      background: #999;
    }
    .note {
      position: absolute;
      top: 4px;
      margin-left: -6px;
      height: 12px;
      width: 12px;
      background: red;
      border-radius: 6px;
    }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SequenceCanvas implements OnChanges {
  @Input() currentPosition: number;
  @Input() channels: Array<any>;
  @Input() channelData: Array<Array<any>>;
  @Input() playing: any;
  @Input() sequenceLength: number;
  @Input() bpm: number;
  @Input() playMidiNote: (number) => void;

  @ViewChild('sequencePanel') elem: ElementRef;

  constructor() {}

  private calcOffset(beatsElapsed: number) {
    const elapsedPercentage = beatsElapsed / this.sequenceLength;
    const offset = this.sequenceLength * BEAT_WIDTH * elapsedPercentage;
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