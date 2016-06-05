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
import { By } from '@angular/platform-browser';
import { PlayControls } from './index';

class SequencerActions {
  play() {
    return 'play;';
  }
  pause() {
    return 'pause';
  }
}

describe('Component: Sequencer - PlayControls', () => {
  let builder: TestComponentBuilder;

  beforeEachProviders(() => [PlayControls]);
  beforeEach(inject([TestComponentBuilder],
    function (tcb: TestComponentBuilder) {
      builder = tcb;
    }));

  it('should call play function',
    async(inject([PlayControls], (component: PlayControls) => {
      const SequencerActions_ = new SequencerActions;
      spyOn(SequencerActions_, 'play').and.returnValue('play');
      component.play = SequencerActions_.play;
      component.play();
      expect(SequencerActions_.play).toHaveBeenCalled();
    }))
  );

  it('should call pause function',
    async(inject([PlayControls], (component: PlayControls) => {
      const SequencerActions_ = new SequencerActions;
      spyOn(SequencerActions_, 'pause').and.returnValue('pause');
      component.pause = SequencerActions_.pause;
      component.pause();
      expect(SequencerActions_.pause).toHaveBeenCalled();
    }))
  );
});
