import { PipesModule } from './../../pipes/pipes.module';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { LeaveServiceProvider } from '../../providers/leave-service/leave-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Leave } from '../../models/leave.model';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs/Observable';
import { formatDateUsingMoment } from '../../helper/date-formatter';
import * as _ from 'lodash';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  cards: any;
  leaves$: Observable<Leave[]>;
  userInfo$: User;
  teamInfo$: any[] = [];
  leavesToday$: any[] = [];
  _authId: string;
  sliderImg$: any[] = [];
  badgeCount: number;
  constructor(
    public navCtrl: NavController,
    private authService: AuthServiceProvider,
    public leaveService: LeaveServiceProvider,
    public toastCtrl: ToastController,
    private userService: UserServiceProvider) {
    this.cards = new Array(10);
    if (this.authService.afAuth.auth.currentUser) {
      this._authId = this.authService.afAuth.auth.currentUser.uid;
    }
    this.getUserContext();
    this.bindLeaveCarosol();
    this.bindSlider();
  }

  async bindLeaveCarosol() {
    let isManager = localStorage.getItem('isManagerRole');
    let myTeam = localStorage.getItem('myTeam');
    let myId = localStorage.getItem('myId');
    await this.leaveService.getLeaveByDateRange(false, myTeam, new Date(), new Date(), myId)
      .subscribe(result => {
        console.log(result);
        this.leavesToday$ = result;
        // this.leavesToday$ = _.filter(result, function (query) {
        //   return query.to <= new Date();
        // });
      },err=>{
        console.log(err);
        this.showToast(err);
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

  openReports() {
    this.navCtrl.push("ReportPage");
  }

  openNewLeave() {
    this.navCtrl.push("NewLeavePage");
  }

  async getUserContext() {
    await this.userService.getLoggedInUsersMetaInfo(this._authId)
      .subscribe(result => {
        localStorage.setItem('myId', result[0].id);
        localStorage.setItem('myName', result[0].data.name);
        localStorage.setItem('myphotoUrl', result[0].data.photoUrl);
        localStorage.setItem('myTeam', result[0].data.team);
        localStorage.setItem('myEmail', result[0].data.email);
        localStorage.setItem('myMobile', result[0].data.phoneNumber);
        localStorage.setItem('myManager', result[0].data.manager);
        localStorage.setItem('isManagerRole', result[0].data.isManagerRole);
      }, err => {
        console.log(err);
        this.showToast(err);
      });
  }

  async ngOnInit() {
    await this.leaveService
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
