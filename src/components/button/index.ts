import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'rio-button',
  template: `
    <button
      [id]="qaid"
      (click)="handleClick($event)"
      [disabled]="disabled"
      type="{{type || 'button'}}"
      class="btn btn-primary {{className}}">

      <ng-content></ng-content>
    </button>
  `
})
export class RioButton {
  @Input() className: string;
  @Input() type: string;
  @Input() qaid: string;
  @Input() disabled: boolean;
  @Output() onClick = new EventEmitter<Event>();

  handleClick(event) {
    this.onClick.emit(event);
  }
};
