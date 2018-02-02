import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, ToastController, NavParams, Slides } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { PipesModule } from './../../pipes/pipes.module';
import * as firebase from 'firebase';
import { LeaveServiceProvider } from '../../providers/leave-service/leave-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
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
  userContxt: any;
  filteredResult$: any[] = [];
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

    this.getUserContext();
    this.bindSlider();
    this.bindLeaveCarosol();
  }

  bindLeaveCarosol() {
    if (localStorage.getItem('userContext') != null && localStorage.getItem('userContext') != '') {
      let isManager = JSON.parse(localStorage.getItem('userContext')).isManager;
      let myTeam = localStorage.getItem('teamId');
      let myId = JSON.parse(localStorage.getItem('userContext')).email;
      let isManagerRole: boolean = JSON.parse(localStorage.getItem('userContext')).isManager;
      var toDTTMtdy = new Date(new Date(this.tdydate).setHours(23, 59, 59, 0));
      var toDTTMtmrw = new Date(new Date(this.tmrdate).setHours(23, 59, 59, 0));

      if (!isManagerRole) {
        this.leaveService.getTdyandTmrwleavelist(isManager, myTeam, this.tdydate, myId)
          .subscribe(leaves => {
            leaves.forEach((leaveItem: any) => {
              if (leaveItem.from <= toDTTMtdy)
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
            //to Get Leave for Tomorrow
            this.leaveService.getTdyandTmrwleavelist(isManager, myTeam, this.tmrdate, myId)
              .subscribe(leavestmr => {
                leavestmr.forEach((leaveItems: any) => {
                  if (leaveItems.from <= toDTTMtmrw)
                    leaveItems.owner.get()
                      .then(userRefs => {
                        var users = userRefs.data();

                        if (users.team != null && users.team != '') {
                          users.team.get()
                            .then(teamRef => {
                              users.team = teamRef.data();
                            });
                          if (users.team.id == myTeam) {
                            leaveItems.owner = users;
                            this.leavesTmrw$.push(leaveItems);
                          }
                        }
                      });
                });
              });
          });
      }
      else {
        //Get Tdy and Tmrw leaves for Manager Role
        //to Get Leave for today
        this.leaveService.getTdyandTmrwleavelist(isManager, myTeam, this.tdydate, myId)
          .subscribe(leaves => {
            leaves.forEach((leaveItem: any) => {

              if (leaveItem.from <= toDTTMtdy)
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
            //to Get Leave for Tomorrow
            this.leaveService.getTdyandTmrwleavelist(isManager, myTeam, this.tmrdate, myId)
              .subscribe(leavestmr => {
                leavestmr.forEach((leaveItems: any) => {
                  if (leaveItems.from <= toDTTMtmrw)
                    leaveItems.owner.get()
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
                            leaveItems.owner = users;
                            this.leavesTmrw$.push(leaveItems);
                          }
                        }
                      });
                });
              });
          });

      }
    }
  }

  bindSlider() {
    this.sliderImg$ = [
      "assets/imgs/lms1.jpg",
      "assets/imgs/lms2.jpg",
      "assets/imgs/lms3.jpg",
      "assets/imgs/lms4.jpg",
      "assets/imgs/lms5.jpg",
      "assets/imgs/lms6.jpg",
      "assets/imgs/lms7.jpg"
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

  getUserContext() {
    this.userService.getUserById(this._authId)
      .subscribe(result => {
        //console.log(result)
        let userContext: any = {
          "name": result.name,
          "email": result.email,
          "photoUrl": result.photoUrl,
          "phoneNumber": result.phoneNumber,
          "isManager": result.isManager
        };
        localStorage.setItem('userContext', JSON.stringify(userContext));
      }, err => {
        console.log(err);
        this.showToast(err);
      });
  }

  ngOnInit() {
    if (localStorage.getItem('userContext') != null && localStorage.getItem('userContext') != '') {
      let ctx = JSON.parse(localStorage.getItem('userContext'));
      this.leaveService
        .getBadgeCount(ctx.isManager, ctx.email)
        .subscribe((result: any) => {
          if (ctx.isManager == "true") {
            result.forEach((lvRef: any) => {
              lvRef.owner.get().then(userRef => {
                var user = userRef.data();
                if (user.manager != null && user.manager != '') {
                  user.manager.get()
                    .then(managerRef => {
                      user.manager = managerRef.data();
                    });
                  if (user.manager.id == ctx.email) {
                    lvRef.owner = user;
                    this.filteredResult$.push(lvRef);
                  }
                }
              })
            });
            this.badgeCount = this.filteredResult$.length;
          }
          else {
            let filteredResult = _.filter(result, function (obj) {
              return obj.owner.id == ctx.email;
            });
            this.badgeCount = filteredResult.length;
          }
        }, err => {
          console.log(err);
          this.showToast(err);
        });
    }
  }

  showToast(alert_message: string) {
    let toast = this.toastCtrl.create({
      message: alert_message,
      duration: 4000,
      position: 'bottom'
    });
    toast.present(toast);
  }
}
