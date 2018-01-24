import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import * as moment from 'moment';
import { LeaveServiceProvider } from '../../providers/leave-service/leave-service';
import { LeaveStatus } from '../../models/leavestatus.enum';

@IonicPage()
@Component({
  selector: 'page-my-leaves',
  templateUrl: 'my-leaves.html',
})
export class MyLeavesPage {

  eventSource = [];
  viewTitle: string;
  selectedDay = new Date();
  uid:string = localStorage.getItem('myId');
  calendar = {
    mode: 'month',
    currentDate: new Date()
  };

  constructor(public navCtrl: NavController, 
    private leaveService: LeaveServiceProvider,
    public toastCtrl: ToastController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.bindCalender();
  }

  openNewLeave() {
    this.navCtrl.push("NewLeavePage");
  }
 
  onViewTitleChanged(title) {
    this.viewTitle = title;
  }
 
  onEventSelected(event) {
  }
 
  onTimeSelected(ev) {
    this.selectedDay = ev.selectedTime;
  }

  bindCalender(){
    this.leaveService.getMyLeaveHistory(this.uid)
    .subscribe(history=>{
        history.forEach(lv=>{
          this.eventSource.push({
            "allDay": !lv.isHalfDay,
            startTime: lv.from,
            endTime: moment(lv.to).add(1,'days').toDate(),
            status: (LeaveStatus[(Number(lv.status))]).toString(),
            title: lv.reason
          })
        });
    },err=>{
      this.showToast(err);
    });
  }

  showToast(alert_message:string){
    let toast = this.toastCtrl.create({
      message: alert_message,
      duration: 2000,
      position: 'bottom'
    }); 
    toast.present(toast);
  }

}

