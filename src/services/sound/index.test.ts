import {
  it,
  xit,
  describe,
  expect,
  inject,
  async,
  beforeEach,
  beforeEachProviders
} from '@angular/core/testing';

import {SoundService} from './index';

describe('Testing sound service - p5', () => {
  let soundService;

  beforeEach (() => {
    soundService = new SoundService();
  });

  it('should have created a canvas', () => {
    expect(soundService.p5.canvas).not.toBe(undefined);
    expect(soundService.p5.canvas).not.toBe(null);
  });

});
