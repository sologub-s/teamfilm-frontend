/**
 * @TODO Move to polyfills and fix 'Uncaught reflect-metadata shim is required when using class decorators'
 */
import 'zone.js';
import 'reflect-metadata';

import './styles/styles.css';

import 'jquery';

import 'jquery.initialize';

import 'headroom';

import 'headroom-jquery';

import 'bootstrap';

/**
 * @see http://bootstrapswitch.com/options.html
 */
import '../node_modules/bootstrap-switch/dist/js/bootstrap-switch.js';

/**
 * @see https://www.npmjs.com/package/bootstrap-datepicker
 */
import '../node_modules/bootstrap-datepicker/dist/js/bootstrap-datepicker.js';

import 'validate.js';

/**
 * @TODO Move to polyfills and fix 'Uncaught reflect-metadata shim is required when using class decorators'
 */
if ('production' !== ENV) {
    require('zone.js/dist/long-stack-trace-zone');
}

/**
 * Angular bootstrapping
 */
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { decorateModuleRef } from './app/environment';

/**
 * App Module
 * our top level module that holds all of our components
 */
import { AppModule } from './app/app.module';

/**
 * Bootstrap our Angular app with a top level NgModule
 */
export function main(): Promise<any> {
  return platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .then(decorateModuleRef)
    .catch((err) => console.error(err));
}

import 'assets/js/custom.js';

/**
 * Needed for hmr
 * in prod this is replace for document ready
 */
switch (document.readyState) {
  case 'loading':
    document.addEventListener('DOMContentLoaded', _domReadyHandler, false);
    break;
  case 'interactive':
  case 'complete':
  default:
    main();
}

function _domReadyHandler() {
 document.removeEventListener('DOMContentLoaded', _domReadyHandler, false);
 main();
}