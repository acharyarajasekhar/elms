import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { commonMethods } from '../../helper/common-methods'
import { LeaveServiceProvider } from '../../providers/leave-service/leave-service';
import { NotificationService } from '../../providers/notification-service/notification-service';

@IonicPage()
@Component({
  selector: 'page-seeall-tdy',
  templateUrl: 'seeall-tdy.html',
})
export class SeeAllTdyPage {
  uid: string;
  leavesToday$: any = [];
  isManager: string;
  GetCurrentDate: Date = new Date();
  d: Date = new Date(new Date().setHours(0, 0, 0, 0));
  tdydate: any = this.d.getMonth() + 1 + "/" + this.d.getDate() + "/" + this.d.getFullYear();
  constructor(public navCtrl: NavController,
    private _LeaveService: LeaveServiceProvider,
    private _cmnMethods: commonMethods, private _notify: NotificationService,
    public navParams: NavParams) {
    this.GetTdyLeaveDetails();
  }

  ionViewDidLoad() {
  }

  GetTdyLeaveDetails() {
    if (localStorage.getItem('userContext') != null && localStorage.getItem('userContext') != '') {
      let isManager = JSON.parse(localStorage.getItem('userContext')).isManager;
      let isManagerRole: boolean = JSON.parse(localStorage.getItem('userContext')).isManager;
      let myTeam = localStorage.getItem('teamId');
      let myId = JSON.parse(localStorage.getItem('userContext')).email;
      var toDTTM = new Date(new Date(this.tdydate).setHours(23, 59, 59, 0));
      if (!isManagerRole) {
        this._LeaveService.getTdyandTmrwleavelist(isManager, myTeam, this.tdydate, myId)
          .subscribe(leaves => {

            leaves.forEach((leaveItem: any) => {
              if (leaveItem.from <= toDTTM)
                leaveItem.owner.get()
                  .then(userRef => {
                    var user = userRef.data();
                    if (user.team != null && user.team != '') {
                      user.team.get()
                        .then(teamRef => {
                          user.team = teamRef.data();
                        });
                      if (user.team.id == myTeam) {
                        leaveItem.owner = user;

                        this.leavesToday$.push(leaveItem);
                      }
                    }
                  });
            });
          });
      }
      else {
        this._LeaveService.getTdyandTmrwleavelist(isManager, myTeam, this.tdydate, myId)
          .subscribe(leaves => {

            leaves.forEach((leaveItem: any) => {
              if (leaveItem.from <= toDTTM)
                leaveItem.owner.get()
                  .then(userRef => {
                    var user = userRef.data();

                    if (user.team != null && user.team != '') {
                      user.team.get()
                        .then(teamRef => {
                          user.team = teamRef.data();
                        });
                    }
                    if (user.manager != null && user.manager != '') {
                      user.manager.get()
                        .then(managerRef => {
                          user.manager = managerRef.data();
                        });
                      if (user.manager.id == myId) {
                        leaveItem.owner = user;
                        this.leavesToday$.push(leaveItem);
                      }
                    }
                  });
            });
          });
      }
    }
  }
}
