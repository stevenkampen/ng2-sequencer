import {
  Component,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';

import {
  NgStyle
} from '@angular/common';

@Component({
  selector: 'octave',
  template: `
    <div style="height:100%;width:100%;background:#FFF;position:relative;">
      <table style="height:100%;width:100%;text-align:center;
        table-layout:fixed;">
        <tbody>
          <tr>
            <td *ngFor="let key of whiteKeys; let i = index"
              style="border:1px solid #000;color:#333;"
              (click)="handlePress(key)">
            </td>
          </tr>
        </tbody>
      </table>
      <div *ngFor="let key of blackKeys; let i = index"
           [ngStyle]="{left: blackKeyOffsetMap[key] * 100/7 + '%'}"
           style="position:absolute;top:0;color:#FFF;width:10px;
           margin-left:-5px;height:70%;background:#000;"
           (click)="handlePress(key)">
      </div>
    </div>
  `,
  directives: [NgStyle],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class Octave {
  @Input() handlePress: (number) => void;

  private blackKeyOffsetMap = {
    1: 1,
    3: 2,
    6: 4,
    8: 5,
    10: 6,
  };

  private whiteKeys: Array<number> = [0, 2, 4, 5, 7, 9, 11];
  private blackKeys: Array<number> = [1, 3, 6, 8, 10];

  constructor() {
  }
};
