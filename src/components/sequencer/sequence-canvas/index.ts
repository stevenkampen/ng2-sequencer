import {
  Component,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';

import { RioButton } from '../../button';
import { Map } from 'immutable';


@Component({
  selector: 'sequence-canvas',
  template: `
    <div>
      <div *ngFor="let channel of sequenceData" style="background:#333;" 
        class="flex">
        <div *ngFor="let measure of channel" style="width:33.3%;">
          <div *ngFor="let soundId of measure"
            (click)="soundId ? handleNoteClick(soundId) : null"
            style="border-bottom:1px solid white;float:left;width:25%;
            border-left:1px solid white;text-align:center;color:white;">
            {{ soundId || '__' }}
          </div>
        </div>
      </div>
    </div>
  `,
  directives: [RioButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SequenceCanvas {
  @Input() channelCount: number = 0;
  @Input() measureCount: number = 0;
  @Input() sequenceData: Array<Array<number>> = [];
  @Input() soundData: Map<string, number>;
  @Input() playMidiNote: (number) => void;

  constructor() {
  }

  handleNoteClick = (soundId) => {
    const [octave, note] = soundId.split('_');
    const midiNote = (octave * 12) + this.soundData.get(note);
    this.playMidiNote(midiNote);
  };
};
