import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { appConfig } from './app.config';

export const browserConfig: ApplicationConfig = {
  providers: [
    ...appConfig.providers,
    provideClientHydration(withEventReplay()),
    importProvidersFrom(FontAwesomeModule)
  ]
};
