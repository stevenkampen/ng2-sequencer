///<reference path="./dev-types.d.ts"/>

import { Map, fromJS } from 'immutable';
const persistState = require('redux-localstorage');
import logger from './configure-logger';

const baseEnhancers = [];

export const middleware = __DEV__ ? [ logger ] : [];

export const enhancers = __DEV__ && window.devToolsExtension ?
  [ ...baseEnhancers, window.devToolsExtension() ] :
  baseEnhancers;
