import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LeaveServiceProvider } from '../../providers/leave-service/leave-service';
import * as moment from 'moment';

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
  reason = this.navParams.get('reason');
  photoUrl = this.navParams.get('photoUrl');

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private leaveService:LeaveServiceProvider,
    public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailsviewPage');
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  getOverlappedLeaves(from,to){
    this.leaveService.getLeaveByDuration(from.toISOString(),to.toISOString())
    .subscribe(lv=>{
       this.otherLeaves$ = lv;
       console.log(this.otherLeaves$);
    });
  }
}
