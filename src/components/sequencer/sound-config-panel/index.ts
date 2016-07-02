import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ViewChild,
} from '@angular/core';

import { RioButton } from '../../button';

import {
  NgStyle,
  AsyncPipe,
} from '@angular/common';

import { Map } from 'immutable';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'sound-config-panel',
  template: `
    <div class="flex">
      <input class="input"
        [value]="sound.get('time')"
        (input)="timeUpdateSubject.next($event.target.value)" />
      <rio-button [className]="'bg-red'" (click)="removeSound()">
        <i class="fa fa-trash"></i>
      </rio-button>
    </div>
  `,
  pipes: [],
  directives: [NgStyle, RioButton],
  encapsulation: ViewEncapsulation.Emulated,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SoundConfigPanel {
  @Input() sound: any;
  @Input() updateTime: (time: number) => void;
  @Input() removeSound: () => void;

  private timeUpdateSubject: Subject<number> = new Subject<number>();

  constructor() {
    this.timeUpdateSubject.debounceTime(250).subscribe(value => {
      this.updateTime(value);
    });
  }
};
