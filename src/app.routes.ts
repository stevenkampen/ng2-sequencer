import {
  provideRouter,
  RouterConfig,
} from '@angular/router';

import { SequencerPage } from './containers/sequencer-page';

export const APP_ROUTER_PROVIDERS = [
  provideRouter([
    { path: '', component: SequencerPage },
  ]),
];
