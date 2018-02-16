import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LeaveServicev2Provider } from '../../providers/leave-servicev2/leave-servicev2';
import { AppContextProvider } from '../../providers/app-context/app-context';



@IonicPage()
@Component({
  selector: 'page-detailsview',
  templateUrl: 'detailsview.html',
})
export class DetailsviewPage {

  name = this.navParams.get('name');
  from = this.navParams.get('from');
  to = this.navParams.get('to');
  reason = this.navParams.get('reason');
  photoUrl = this.navParams.get('photoUrl');

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private appContext: AppContextProvider,
    private leavesSvc: LeaveServicev2Provider,
    public viewCtrl: ViewController) {
      this.getOverlappedLeaves(this.from,this.to);
      }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailsviewPage');
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }


   getOverlappedLeaves(frDate,toDate) {
    if (frDate != "" && toDate !="") {
       this.leavesSvc.searchLeavesByDateRange(frDate,toDate,this.appContext.duringthistimeleaves);
    }
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
