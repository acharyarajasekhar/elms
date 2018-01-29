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
  selector: 'page-seeall-tdy',
  templateUrl: 'seeall-tdy.html',
})
export class SeeAllTdyPage {
  uid: string;
  leavesToday$:any=[];
  isManager:string;
  GetCurrentDate: Date = new Date();
  d: Date = new Date(new Date().setHours(0, 0, 0, 0));
  t: Date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  tdydate: any = this.d.getFullYear() + "-" + this.d.getMonth() + 1 + "-" + this.d.getDate();
  tmrdate: any = this.t.getFullYear() + "-" + this.t.getMonth() + 1 + "-" + this.t.getDate();
  tdate: Date;
  tmdate: Date;
  constructor(public navCtrl: NavController,
    private _LeaveService: LeaveServiceProvider,
    private formgroup: FormBuilder,
    private _cmnMethods: commonMethods,private _notify:NotificationService,
    public navParams: NavParams) {
    this.GetTdyLeaveDetails();
  }

  ionViewDidLoad() {
  }

  GetTdyLeaveDetails() {
    let isManager = localStorage.getItem('isManagerRole');
    let myTeam = localStorage.getItem('myTeam');
    let myId = localStorage.getItem('myId');
    var toDTTM = new Date("01/30/2018");
    this.tmdate = new Date(this.tmrdate);
    this._LeaveService.getleavelistnewDB()
    .subscribe(leaves => {
      var myLeaves:Array<any> = [];    
      leaves.forEach((leaveItem:any) => { 
        if(leaveItem.FromDTTM <= toDTTM)       
        leaveItem.Owner.get()
          .then(userRef => { 
              var user = userRef.data(); 
              user.Manager.get()
                .then(managerRef => {
                  user.Manager = managerRef.data();
                });
              user.Team.get()
                .then(teamRef => {
                  user.Team = teamRef.data();
                });
              leaveItem.Owner = user;
              this.leavesToday$.push(leaveItem); 
          });
      });
      console.log(this.leavesToday$);
    })
   }
}
