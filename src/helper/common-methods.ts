import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Loading } from 'ionic-angular/components/loading/loading';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class commonMethods {
  loader:Loading
    constructor(public toastCtrl: ToastController,private loadevent:LoadingController)
    {

    }
    showToast(alert_message: string) {
        let toast = this.toastCtrl.create({
          message: alert_message,
          duration: 2000,
          position: 'bottom'
        });
        toast.present(toast);
      }
      InitializeLoader()
      {
      this.loader= this.loadevent.create({
        content: "Please wait..."
      })
      this.loader.present();
    }

}
