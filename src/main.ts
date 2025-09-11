import 'zone.js'; // ✅ Required for Angular with zones
import { bootstrapApplication } from '@angular/platform-browser';
import { browserConfig } from './app/app.config.browser';
import { App } from './app/app';

// Only import flowbite in browser environment
if (typeof window !== 'undefined') {
  import('flowbite');
}

bootstrapApplication(App, browserConfig)
  .catch((err) => console.error(err));
