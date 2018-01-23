import { Pro } from '@ionic/pro';

import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { IonicErrorHandler } from 'ionic-angular';

import { IonicProConfig } from '../../app/ionic.pro.config';


@Injectable()
export class AppErrorHandlerProvider implements ErrorHandler {
  ionicErrorHandler: IonicErrorHandler;

  constructor(injector: Injector) {
    try {
      this.ionicErrorHandler = injector.get(IonicErrorHandler);
    } catch(e) {
        console.log(e);
        // Unable to get the IonicErrorHandler provider, ensure 
        // IonicErrorHandler has been added to the providers list below
    }
  }

  handleError(err: any): void {
    IonicProConfig.monitoring.handleNewError(err);
        // Remove this if you want to disable Ionic's auto exception handling
        // in development mode.
        this.ionicErrorHandler && this.ionicErrorHandler.handleError(err);
  }
}