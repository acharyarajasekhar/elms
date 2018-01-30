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
  tdydate: any = this.d.getMonth() + 1 + "/" + this.d.getDate()+"/"+this.d.getFullYear();
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
      var toDTTM = new Date(new Date(this.tdydate).setHours(23, 59, 59, 0));
      this._LeaveService. getleavelistHomeNewDB( isManager, myTeam, this.tdydate, myId)
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
                this.leavesToday$.push(leaveItem); 
            });
        });
      });
     }
}
