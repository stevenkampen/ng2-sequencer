import {
  Component,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';

import { Octave } from './octave.ts';
import { Observable } from 'rxjs';

@Component({
  selector: 'keyboard',
  template: `
    <div style="height:120px;position:absolute;left:0;bottom:125px;width:100%;
      text-align:center;left:10.42%;width:79.16%;">
      <div *ngFor="let pressHandler of topOctaveHandlers; let i = index"
        style="width:20%;height:100%;float:left;">
        <octave [handlePress]="pressHandler"></octave>
      </div>
    </div>
    <div style="height:120px;position:absolute;left:2.5%;bottom:5px;width:95%;
      text-align:center;">
      <div *ngFor="let pressHandler of bottomOctaveHandlers; let i = index"
        style="width:16.66%;height:100%;float:left;">
        <octave style="height:100%;width:100%;"
          [handlePress]="pressHandler"></octave>
      </div>
    </div>
  `,
  directives: [Octave],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class Keyboard {
  @Input() playMidiNote: (number) => void;

  private constructHandlers = (octaves: Array<number>) => {
    const that = this;
    return octaves.map((octave: number) => {
      return (noteIndex: number) => {
        that.playMidiNote(octave * 12 + noteIndex);
      };
    });
  };

  private topOctaveHandlers: Array<any>
      = this.constructHandlers([6, 7, 8, 9, 10]);

  private bottomOctaveHandlers: Array<any>
      = this.constructHandlers([0, 1, 2, 3, 4, 5]);

  constructor() {}
};
