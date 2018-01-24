import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, ToastController,NavParams } from 'ionic-angular';
import { LeaveServiceProvider } from '../../providers/leave-service/leave-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Leave } from '../../models/leave.model';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { AngularFireAuth } from 'angularfire2/auth';

import { PipesModule } from './../../pipes/pipes.module';
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
  leavesTmrw$: any[] = [];
  _authId: string;
  sliderImg$: any[] = [];
  badgeCount: number;
  d: Date = new Date(new Date().setHours(0, 0, 0, 0));
  t: Date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  tdydate : any =  this.d.getFullYear()+"-"+ this.d.getMonth()+1 +"-"+  this.d.getDate();
  tmrdate : any =  this.t.getFullYear()+"-"+ this.t.getMonth()+1 +"-"+  this.t.getDate();
  tdate : Date;
  tmdate : Date;
  constructor(
    public navCtrl: NavController,
    private authService: AuthServiceProvider,
    public leaveService: LeaveServiceProvider,
    public toastCtrl: ToastController,
    private userService: UserServiceProvider) {
      this.tdate =  new Date(this.tdydate);
      this.tmdate =  new Date(this.tmrdate);
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
    await this.leaveService.getLeavelstByDateRange(isManager, myTeam, this.tdate, this.tdate, myId)
      .subscribe(result => {
        console.log(result);
        let tDate = this.tdate;
        this.leavesToday$ = _.filter(result, function (query) {
          return query.to >= tDate;
         
       });
      },err=>{
        console.log(err);
        this.showToast(err);
      });

      await this.leaveService.getLeavelstByDateRange(isManager, myTeam, this.tmdate, this.tmdate, myId)
      .subscribe(results => {
        console.log(results);
        let tmDate =this.tmdate;
        this.leavesTmrw$ = _.filter(results, function (query) {
          return query.to >= tmDate;
       });

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

  getUserContext() {
    this.userService.getLoggedInUsersMetaInfo(this._authId)
      .subscribe(result => {
        localStorage.setItem('myId', result[0].id);
        localStorage.setItem('myName', result[0].data.name);
        localStorage.setItem('myphotoUrl', result[0].data.photoUrl);
        localStorage.setItem('myTeam', result[0].data.team);
        localStorage.setItem('myEmail', result[0].data.email);
        localStorage.setItem('myMobile', result[0].data.phoneNumber);
        localStorage.setItem('myManager', result[0].data.manager);
        localStorage.setItem('isManagerRole', result[0].data.isManagerRole);

        console.log(localStorage.getItem('myId'));
        console.log(localStorage.getItem('myName'));
        console.log(localStorage.getItem('myphotoUrl'));
        console.log(localStorage.getItem('myTeam'));
        console.log(localStorage.getItem('myEmail'));
        console.log(localStorage.getItem('myMobile'));
        console.log(localStorage.getItem('myManager'));
        console.log(localStorage.getItem('isManagerRole'));
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
