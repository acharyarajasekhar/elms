import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormsModule, NgForm } from '@angular/forms';
import { commonMethods } from '../../helper/common-methods'
import * as _ from 'lodash';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LeaveServiceProvider } from '../../providers/leave-service/leave-service';
import { NotificationService } from '../../providers/notification-service/notification-service';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-seeall-tmrw',
  templateUrl: 'seeall-tmrw.html',
})
export class SeeAllTmrwPage {
  leavesTmrw$:any[] = [];
  t: Date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  tmrdate: any = this.t.getFullYear() + "-" + this.t.getMonth() + 1 + "-" + this.t.getDate();
  tmdate: Date;
  constructor(public navCtrl: NavController,
      private _LeaveService: LeaveServiceProvider,
      private _cmnMethods: commonMethods,private _notify:NotificationService,
      public navParams: NavParams) {
      this.GetTmrwLeaveDetails();
  }

  ionViewDidLoad() {
  }

  GetTmrwLeaveDetails() {
    let isManager = localStorage.getItem('isManagerRole');
    let myTeam = localStorage.getItem('myTeam');
    let myId = localStorage.getItem('myId');
   
    this.tmdate = new Date(this.tmrdate);
    this._LeaveService.getleavelistnewDB()
   }

}
