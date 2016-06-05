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
import { ChannelCanvas } from './index';

describe('Component: Sequencer - ChannelCanvas', () => {
  let builder: TestComponentBuilder;

  beforeEachProviders(() => [ChannelCanvas]);
  beforeEach(inject([TestComponentBuilder],
    function (tcb: TestComponentBuilder) {
      builder = tcb;
    }));

});
