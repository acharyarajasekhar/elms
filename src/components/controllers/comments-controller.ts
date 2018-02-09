import  {Component, Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import {LeaveServicev2Provider} from '../../providers/leave-servicev2/leave-servicev2';

@Injectable()

export class commentsController
{

constructor(private _commentsPopup:AlertController,private _leaveService:LeaveServicev2Provider)
{

}

presentPrompt(LeaveID: string,title:string,alertMsg:string,leaveStatus:number) {
    let alert = this._commentsPopup.create({
      title:title,
      message:alertMsg,
      inputs: [
        {
          name: 'comments',
          placeholder: 'Comments'
        }
      ],
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
           this._leaveService.updateLeaveStatus(LeaveID,leaveStatus, data.comments);
          }
        }
      ]
    });
    alert.present();
  }

}
