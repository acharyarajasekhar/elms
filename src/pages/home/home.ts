import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { AppContextProvider } from '../../providers/app-context/app-context';
import * as moment from 'moment';
import { LeaveServicev2Provider } from '../../providers/leave-servicev2/leave-servicev2';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private slides: Array<string> = [
    "assets/imgs/lms1.jpg",
    "assets/imgs/lms2.jpg",
    "assets/imgs/lms3.jpg",
    "assets/imgs/lms4.jpg",
    "assets/imgs/lms5.jpg",
    "assets/imgs/lms6.jpg",
    "assets/imgs/lms7.jpg"
  ];

  constructor(
    public navCtrl: NavController,
    private leavesSvc: LeaveServicev2Provider,
    private appContext: AppContextProvider) {
  }

  ionViewWillEnter () {
    var from = moment(new Date()).startOf('day').toDate();
    var to = moment(new Date()).add(90, 'days').endOf('day').toDate();
    this.leavesSvc.searchLeavesByDateRange(from, to,this.appContext.searchedLeaves);
  }

  goToPage(pageName) {
    this.navCtrl.push(pageName);
  }
}
