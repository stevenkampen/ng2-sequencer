import 'reflect-metadata';
import 'core-js/es6';
import 'core-js/es7/reflect';
import '../shims/shims_for_IE';
import 'zone.js/dist/zone';
import 'ts-helpers';

import { enableProdMode, provide } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';
import { ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { APP_BASE_HREF } from '@angular/common/index';
import { NgRedux } from 'ng2-redux';

import { RioSampleApp } from './containers/sample-app';
import { SoundService } from './services/sound/';

declare let __PRODUCTION__: any;

require('style!css!font-awesome/css/font-awesome.css');

if (__PRODUCTION__) {
  enableProdMode();
} else {
  require('zone.js/dist/long-stack-trace-zone');
}

bootstrap(RioSampleApp, [
  NgRedux,
  SoundService,
  HTTP_PROVIDERS,
  ROUTER_PROVIDERS,
  provide(APP_BASE_HREF, { useValue: '/' })
]);
