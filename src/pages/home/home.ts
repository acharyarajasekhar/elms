import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, ToastController, NavParams, Slides } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { PipesModule } from './../../pipes/pipes.module';
import * as firebase from 'firebase';
import { LeaveServiceProvider } from '../../providers/leave-service/leave-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Leave } from '../../models/leave.model';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  public user: Observable<firebase.User>;
  cards: any;
  slides: Slides;
  leaves$: Observable<Leave[]>;
  userInfo$: User;
  teamInfo$: any[] = [];
  leavesToday$: any[] = [];
  leavesTmrw$: any[] = [];
  _authId: string;
  _authEmail: string;
  sliderImg$: any[] = [];
  sliderImgurl$: any[] = [];
  badgeCount: number;
  d: Date = new Date(new Date().setHours(0, 0, 0, 0));
  tdydate: any = this.d.getMonth() + 1 + "/" + this.d.getDate() + "/" + this.d.getFullYear();
  t: Date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  tmrdate: any = this.t.getMonth() + 1 + "/" + this.t.getDate() + "/" + this.t.getFullYear();

  constructor(
    public navCtrl: NavController,
    private afAuth: AngularFireAuth,
    public leaveService: LeaveServiceProvider,
    public toastCtrl: ToastController,
    private userService: UserServiceProvider) {
    this.cards = new Array(10);
    if (this.afAuth.auth.currentUser != null) {
      this._authId = this.afAuth.auth.currentUser.email;
    }
    else if (localStorage.getItem('userContext') != null || localStorage.getItem('userContext') != '') {
      this._authId = JSON.parse(localStorage.getItem('userContext')).email;
    }

    this.getUserContextNew();
    this.bindLeaveCarosol();
    this.bindSlider();
  }

  bindLeaveCarosol() {
    let isManager = localStorage.getItem('isManagerRole');
    let myTeam = localStorage.getItem('myTeam');
    let myId = localStorage.getItem('myId');

    var toDTTMtdy = new Date(new Date(this.tdydate).setHours(23, 59, 59, 0));
    var toDTTMtmrw = new Date(new Date(this.tmrdate).setHours(23, 59, 59, 0));
    //to Get Leave for Today
    this.leaveService.getleavelistHomeNewDB(isManager, myTeam, this.tdydate, myId)
      .subscribe(leaves => {
        leaves.forEach((leaveItem: any) => {
          if (leaveItem.from <= toDTTMtdy)
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
        //to Get Leave for Tomorrow
        this.leaveService.getleavelistHomeNewDB(isManager, myTeam, this.tmrdate, myId)
          .subscribe(leavestmr => {
            leavestmr.forEach((leaveItems: any) => {
              if (leaveItems.from <= toDTTMtmrw)
                leaveItems.owner.get()
                  .then(userRefs => {
                    var users = userRefs.data();
                    users.manager.get()
                      .then(managerRefs => {
                        users.manager = managerRefs.data();
                      });
                    users.team.get()
                      .then(teamRefs => {
                        users.team = teamRefs.data();
                      });
                    leaveItems.owner = users;
                    this.leavesTmrw$.push(leaveItems);
                  });
            });
          });
      });
  }

  bindSlider() {
    this.sliderImg$ = [
      "assets/imgs/LMS1.jpg",
      "assets/imgs/LMS2.jpg",
      "assets/imgs/LMS3.jpg"
    ];
  }

  ionViewDidLoad() {
    this.badgeCount = 0;
  }

  openSearch() {
    this.navCtrl.push("SearchLeavesPage");
  }

  openNotifications() {
    this.navCtrl.push("NotificationsPage");
  }

  openSeealltdy() {
    this.navCtrl.push("SeeAllTdyPage");
  }

  openSeealltmrw() {
    this.navCtrl.push("SeeAllTmrwPage");
  }

  openReports() {
    this.navCtrl.push("ReportPage");
  }

  openNewLeave() {
    this.navCtrl.push("NewLeavePage");
  }

  getUserContextNew() {
    this.userService.getUserById(this._authId)
      .subscribe(result => {
        let userContext: any = {
          "name": result.name,
          "email": result.email,
          "photoUrl": result.photoUrl,
          "phoneNumber": result.phoneNumber
        };
        localStorage.setItem('userContext', JSON.stringify(userContext));
      }, err => {
        console.log(err);
        this.showToast(err);
      });
  }

  ngOnInit() {
    this.leaveService
      .getBadgeCount(localStorage.getItem('isManagerRole'))
      .subscribe(result => {
        this.badgeCount = result.length;
      }, err => {
        console.log(err);
        this.showToast(err);
      });
  }



  showToast(alert_message: string) {
    let toast = this.toastCtrl.create({
      message: alert_message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present(toast);
  }
}
