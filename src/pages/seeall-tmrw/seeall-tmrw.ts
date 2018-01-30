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
  tmrdate: any = this.t.getMonth() + 1 + "/" + this.t.getDate()+ "/" +this.t.getFullYear();
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
    var toDTTM = new Date(new Date(this.tmrdate).setHours(23, 59, 59, 0));
    this._LeaveService. getleavelistHomeNewDB( isManager, myTeam, this.tmrdate, myId)
    .subscribe(leaves => { 
      leaves.forEach((leaveItem:any) => {  
        if(leaveItem.from <= toDTTM)  
        leaveItem.owner.get()
          .then(userRef => { 
              var user = userRef.data(); 
              user.manager.get()
                .then(managerRef => {
                  user.manager = managerRef.data();
                });
              user.team.get()
                .then(teamRef => {
                  user.team = teamRef.data();
                });
              leaveItem.owner = user;
              this.leavesTmrw$.push(leaveItem); 
          });
      });
    });
   }

}
