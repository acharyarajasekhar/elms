import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { LeaveServiceProvider } from '../../providers/leave-service/leave-service';
import { formatDateUsingMoment } from '../../helper/date-formatter';
import * as _ from 'lodash';

@IonicPage()
@Component({
  selector: 'page-detailsview',
  templateUrl: 'detailsview.html',
})
export class DetailsviewPage {
  otherLeaves$;
  userId = this.navParams.get('userId');
  name = this.navParams.get('name');
  from = this.navParams.get('from');
  to = this.navParams.get('to');
  status = this.navParams.get('status');
  reason = this.navParams.get('reason');
  photoUrl = this.navParams.get('photoUrl');
  leaves$;
  leaves$Count:number = 0;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl: ToastController,
    private leaveService:LeaveServiceProvider,
    public viewCtrl: ViewController) {
      this.getOverlappedLeaves(this.from,this.to);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailsviewPage');
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  async getOverlappedLeaves(frDate,toDate) {
    let teamId = localStorage.getItem('myTeam');
    let isManager = localStorage.getItem('isManagerRole');
    if (frDate != "" && toDate !="") {
      let unixStartDt = formatDateUsingMoment(frDate, 'U');
      let unixEndDt = formatDateUsingMoment(toDate, 'U');
      let localeStartDt = formatDateUsingMoment(frDate, 'L');
      let localeEndDt = formatDateUsingMoment(toDate, 'L');
      await this.leaveService.getLeaveByDuration(isManager,teamId,localeStartDt, localeEndDt).subscribe(result => {
        this.leaves$ = _.filter(result, function (lv) {
          return lv.unixFrDate >= unixStartDt;
        });
        this.leaves$Count = this.leaves$.length;
      }, err => {
        console.log(err);
        this.showToast(err);
      });
    }
  }

  bindOtherLeaves(){

  }

  showToast(alert_message: string) {
    let toast = this.toastCtrl.create({
      message: alert_message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present(toast);
  }

  getColor(status) {
    switch (status) {
      case 0:
        return 'gray';
      case 1:
        return 'green';
      case 2:
        return 'red';
      default:
        return 'orange';
    }
  }
}
