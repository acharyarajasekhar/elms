import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { serachservice } from '../../providers/search-service/search-service';
import { formatDateUsingMoment } from '../../helper/date-formatter';
import * as _ from 'lodash';

@IonicPage()
@Component({
  selector: 'page-detailsview',
  templateUrl: 'detailsview.html',
})
export class DetailsviewPage {
  otherLeaves$;
  name = this.navParams.get('name');
  from = this.navParams.get('from');
  to = this.navParams.get('to');
  status = this.navParams.get('status');
  reason = this.navParams.get('reason');
  photoUrl = this.navParams.get('photoUrl');
  leavesCollections:any;
  leaves$Count:number = 0;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl: ToastController,
    private leaveService:serachservice,
    public viewCtrl: ViewController) {
      this.getOverlappedLeaves(this.from,this.to);
      this.leaveService.getLeavesCollections()
      .subscribe(Leaves=>{
      this.leavesCollections =Leaves;
      //this._cmnMethods.loader.dismiss();
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailsviewPage');
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

   getOverlappedLeaves(frDate,toDate) {
    let teamId = localStorage.getItem('myTeam');
    let isManager = localStorage.getItem('isManagerRole');
    if (frDate != "" && toDate !="") {
       this.leaveService.getSearchresults(true,teamId,frDate, toDate)
    }
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
