import { Component, ViewEncapsulation, ApplicationRef } from '@angular/core';
import {
  ROUTER_DIRECTIVES,
} from '@angular/router';

import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { Map } from 'immutable';
import { NgRedux, select } from 'ng2-redux';

import { IAppState } from '../reducers';
import rootReducer from '../reducers';
import { middleware, enhancers } from '../store';

@Component({
  selector: 'rio-sample-app',
  directives: [ ROUTER_DIRECTIVES ],
  pipes: [ AsyncPipe ],
  // Allow app to define global styles.
  encapsulation: ViewEncapsulation.None,
  styles: [ require('../styles/index.css') ],
  template: require('./sample-app.tmpl.html')
})

export class RioSampleApp {

  constructor(
    private ngRedux: NgRedux<IAppState>) {

    ngRedux.configureStore(rootReducer, {}, middleware, enhancers);

  }
};
