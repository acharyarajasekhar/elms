import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class ToastMessageProvider {

  constructor(public toastCtrl: ToastController) {
    console.log('Hello ToastMessageProvider Provider');
  }

  showToast(msg:string,err:boolean) {
    let Class:string;
    if(err) //Success
    Class="toast-success";
    else //Error
    Class="toast-error";

    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
      cssClass: Class
    });
    toast.present(toast);
  }



}
