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
  }

  openNewLeave() {
    this.navCtrl.push("CreateLeaveRequestPage");
  }

  addEvent() {
    // let modal = this.modalCtrl.create('EventModalPage', {selectedDay: this.selectedDay});
    // modal.present();
    // modal.onDidDismiss(data => {
    //   if (data) {
    //     let eventData = data;
 
    //     eventData.startTime = new Date(data.startTime);
    //     eventData.endTime = new Date(data.endTime);
 
    //     let events = this.eventSource;
    //     events.push(eventData);
    //     this.eventSource = [];
    //     setTimeout(() => {
    //       this.eventSource = events;
    //     });
    //   }
    // });
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
