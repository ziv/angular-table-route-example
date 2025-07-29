import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection} from '@angular/core';
import {provideRouter, withViewTransitions} from '@angular/router';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import fakeServer from './server';

export const config: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter([], withViewTransitions()),
    provideHttpClient(withFetch(), withInterceptors([fakeServer]))
  ]
};
