import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LeaveServiceProvider, Leave } from '../../providers/leave-service/leave-service';

@IonicPage()
@Component({
  selector: 'page-new-leave',
  templateUrl: 'new-leave.html',
})
export class NewLeavePage {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public leaveService: LeaveServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewLeavePage');
  }

}
