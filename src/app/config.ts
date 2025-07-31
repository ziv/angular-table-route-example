import {
  type ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from "@angular/core";
import { provideRouter, Routes, withViewTransitions } from "@angular/router";
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from "@angular/common/http";
import fakeServer from "./server";
import { MatIconRegistry } from "@angular/material/icon";

const routes: Routes = [
  {
    path: "login",
    loadComponent: () => import("./login"),
  },
  {
    path: "table",
    loadComponent: () => import("./table"),
  },
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
];

export default {
  providers: [
    /**
     * New zonless change detection strategy.
     */
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),

    /**
     * The app uses the `httpResource()` so Angular HTTP client is required.
     * The `fakeServer` interceptor added to mock the server responses.
     */
    provideHttpClient(withFetch(), withInterceptors([fakeServer])),

    /**
     * The application does not have any routes, but it
     * relies on the router for events and view transitions.
     */
    provideRouter(routes, withViewTransitions()),

    /**
     * Some extra configuration for the app.
     */
    provideAppInitializer(() => {
      // See "index.html" for more details about the icons
      inject(MatIconRegistry).setDefaultFontSetClass(
        "material-symbols-outlined",
      );
    }),
  ],
} as ApplicationConfig;
