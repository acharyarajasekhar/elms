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
    if(err) //Error
    Class="toast-error";
    else //Success
    Class="toast-success";

    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
      cssClass: Class
    });
    toast.present(toast);
  }



}
