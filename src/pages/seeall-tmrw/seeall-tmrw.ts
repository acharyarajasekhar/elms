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
  leavesTmrw$: any[] = [];
  t: Date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  tmrdate: any = this.t.getMonth() + 1 + "/" + this.t.getDate() + "/" + this.t.getFullYear();
  constructor(public navCtrl: NavController,
    private _LeaveService: LeaveServiceProvider,
    private _cmnMethods: commonMethods, private _notify: NotificationService,
    public navParams: NavParams) {
    this.GetTmrwLeaveDetails();
  }

  ionViewDidLoad() {
  }

  GetTmrwLeaveDetails() {
    var isManager = JSON.parse(localStorage.getItem('userContext')).isManager;
    let isManagerRole: boolean = JSON.parse(localStorage.getItem('userContext')).isManager;
    let myTeam = localStorage.getItem('teamId');
    let myId = JSON.parse(localStorage.getItem('userContext')).email;
    var toDTTM = new Date(new Date(this.tmrdate).setHours(23, 59, 59, 0));
    //console.log(isManagerRole);
    if (!isManagerRole) {
      //console.log("team role");
      this._LeaveService.getTdyandTmrwleavelist(isManager, myTeam, this.tmrdate, myId)
        .subscribe(leaves => {
          leaves.forEach((leaveItem: any) => {
            if (leaveItem.from <= toDTTM)
              leaveItem.owner.get()
                .then(userRefs => {
                  var users = userRefs.data();

                  if (users.team != null && users.team != '') {
                    users.team.get()
                      .then(teamRef => {
                        users.team = teamRef.data();
                      });
                    if (users.team.id == myTeam) {
                      leaveItem.owner = users;
                      this.leavesTmrw$.push(leaveItem);
                    }
                  }
                });
          });
        });
    }
    else {
      this._LeaveService.getTdyandTmrwleavelist(isManager, myTeam, this.tmrdate, myId)
        .subscribe(leaves => {
          leaves.forEach((leaveItem: any) => {
            if (leaveItem.from <= toDTTM)
              leaveItem.owner.get()
                .then(userRefs => {
                  var users = userRefs.data();

                  if (users.team != null && users.team != '') {
                    users.team.get()
                      .then(teamRef => {
                        users.team = teamRef.data();
                      });
                  }
                  if (users.manager != null && users.manager != '') {
                    users.manager.get()
                      .then(managerRef => {
                        users.manager = managerRef.data();
                      });
                    if (users.manager.id == myId) {
                      leaveItem.owner = users;
                      this.leavesTmrw$.push(leaveItem);
                    }
                  }
                });
          });
        });
    }
  }

}
