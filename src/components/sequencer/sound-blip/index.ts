import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  selector: 'sound-blip',
  template: `
    <div class="note"></div>
  `,
  pipes: [],
  directives: [],
  encapsulation: ViewEncapsulation.Emulated,
  styles: [`
    .note {
      height: 12px;
      width: 16px;
      background: red;
      border-radius: 6px;
    }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SoundBlip {
  @Input() sound: any;

  constructor() {}

};
