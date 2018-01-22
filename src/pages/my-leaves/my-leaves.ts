import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-my-leaves',
  templateUrl: 'my-leaves.html',
})
export class MyLeavesPage {

  eventSource = [];
  viewTitle: string;
  selectedDay = new Date();
 
  calendar = {
    mode: 'month',
    currentDate: new Date()
  };

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyLeavesPage');

    this.eventSource = [{
      "title": "Sick leave",
      "startTime": new Date("01-05-2018 00:00:00"),
      "endTime": new Date("01-10-2018 00:00:00"),
      "allDay": true,
      "status": 1
    },{
      "title": "Cousin marriage leave",
      "startTime": new Date("02-15-2018 00:00:00"),
      "endTime": new Date("02-17-2018 00:00:00"),
      "allDay": true,
      "status": 0
    }];
  }

  openNewLeave() {
    this.navCtrl.push("NewLeavePage");
  }
 
  onViewTitleChanged(title) {
    this.viewTitle = title;
  }
 
  onEventSelected(event) {
    let start = moment(event.startTime).format('LLLL');
    let end = moment(event.endTime).format('LLLL');
    
    // let alert = this.alertCtrl.create({
    //   title: '' + event.title,
    //   subTitle: 'From: ' + start + '<br>To: ' + end,
    //   buttons: ['OK']
    // })
    // alert.present();
  }
 
  onTimeSelected(ev) {
    this.selectedDay = ev.selectedTime;
  }

}
