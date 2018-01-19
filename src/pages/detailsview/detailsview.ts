import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController  } from 'ionic-angular';
import { Leave } from '../../models/leave.model';

@IonicPage()
@Component({
  selector: 'page-detailsview',
  templateUrl: 'detailsview.html',
})
export class DetailsviewPage {

  userId = this.navParams.get('userId');
  name = this.navParams.get('name');
  from = this.navParams.get('from');
  to = this.navParams.get('to');
  reason = this.navParams.get('reason');
  photoUrl = this.navParams.get('photoUrl');

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailsviewPage');
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }
}
