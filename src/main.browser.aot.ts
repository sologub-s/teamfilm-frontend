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

import '../node_modules/bootstrap-switch/dist/js/bootstrap-switch.js';

import 'validate.js';

/**
 * Angular bootstrapping
 */
import { platformBrowser } from '@angular/platform-browser';
import { decorateModuleRef } from './app/environment';
/**
 * App Module
 * our top level module that holds all of our components.
 */
import { AppModuleNgFactory } from '../compiled/src/app/app.module.ngfactory';
/**
 * Bootstrap our Angular app with a top level NgModule.
 */
export function main(): Promise<any> {
  return platformBrowser()
    .bootstrapModuleFactory(AppModuleNgFactory)
    .then(decorateModuleRef)
    .catch((err) => console.error(err));
}

import 'assets/js/custom.js';

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