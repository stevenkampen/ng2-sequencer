import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ViewChild,
} from '@angular/core';

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
    </div>
  `,
  pipes: [],
  directives: [NgStyle],
  encapsulation: ViewEncapsulation.Emulated,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SoundConfigPanel {
  @Input() sound: any;

  private timeUpdateSubject: Subject<number> = new Subject<number>();

  constructor() {
    this.timeUpdateSubject.debounceTime(750).subscribe(value => {
      console.log('newtime:', value);
    });
  }
};
