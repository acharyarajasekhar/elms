import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { AppContextProvider } from '../../providers/app-context/app-context';
import * as moment from 'moment';
import { LeaveServicev2Provider } from '../../providers/leave-servicev2/leave-servicev2';
import { BadgeCounterProvider } from '../../providers/badge-counter';
import { ToastMessageProvider } from '../../providers/toast-message/toast-message';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public badgeArray:any[] = [];
  private slides: Array<string> = [
    "assets/imgs/slides/1.jpg",
    "assets/imgs/slides/2.jpg",
    "assets/imgs/slides/3.jpg",
    "assets/imgs/slides/4.jpg",
    "assets/imgs/slides/5.jpg",
    "assets/imgs/slides/6.jpg",
    "assets/imgs/slides/7.jpg"
  ];

  constructor(
    public navCtrl: NavController,
    private toaster: ToastMessageProvider,
    private leavesSvc: LeaveServicev2Provider,
    private appContext: AppContextProvider,
    private badgeCounter: BadgeCounterProvider) {
  }

  async getBadgeCount(){
    let from = moment(new Date()).startOf('day').toDate();
    let to = moment(new Date()).add(90, 'days').endOf('day').toDate();
    this.leavesSvc.getNotifications(from, to,this.appContext.notificationLeaves);
    this.badgeArray = await this.badgeCounter.filterResults(this.appContext.notificationLeavesCollection, this.appContext.myReporteesCollection,this.appContext.myProfileObject)
  }

  ionViewWillEnter () {
    var from = moment(new Date()).startOf('day').toDate();
    var to = moment(new Date()).add(90, 'days').endOf('day').toDate();
    this.leavesSvc.searchLeavesByDateRange(from, to,this.appContext.searchedLeaves);
    // this.getBadgeCount();  
  }

  goToPage(pageName) {
    this.navCtrl.push(pageName);
  }
}
