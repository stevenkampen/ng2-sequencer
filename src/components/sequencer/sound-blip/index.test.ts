import {
  async,
  beforeEach,
  beforeEachProviders,
  describe,
  expect,
  it,
  inject,
} from '@angular/core/testing';
import { ComponentFixture, TestComponentBuilder }
from '@angular/compiler/testing';
import { Component } from '@angular/core';
import { SoundBlip } from './index';

describe('Component: Button', () => {
  let builder: TestComponentBuilder;

  beforeEachProviders(() => [SoundBlip]);
  beforeEach(inject([TestComponentBuilder],
    function(tcb: TestComponentBuilder) {
      builder = tcb;
    })
  );

  it('should invoke onClick when clicked',
    async(inject([], () => {
      return builder.createAsync(SoundBlip)
        .then((fixture: ComponentFixture<any>) => {
          spyOn(fixture.componentInstance, 'onClick');
          fixture.componentInstance.qaid = 'button-1';
          fixture.detectChanges();
          let compiled = fixture.debugElement.nativeElement;
          compiled.querySelector('#button-1').click();
          expect(fixture.componentInstance.handleClick).toHaveBeenCalled();
        });
    }))
  );
});
