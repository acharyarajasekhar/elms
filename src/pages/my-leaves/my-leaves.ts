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
  history$ :any[]=[];
  eventSource = [];
  viewTitle: string;
  selectedDay = new Date();
  user:any = JSON.parse(localStorage.getItem('userContext'));
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
    this.leaveService.getMyLeaveHistory_mylvs(this.user.email)
    .subscribe(history=>{

      history.forEach((lv:any)=>{
        //console.log(lv);
        var leavesArray = lv.payload.doc.data();
        leavesArray.leaveId = lv.payload.doc.id;
       // console.log(leavesArray);
        leavesArray.owner.get().then(userRef=>{
             let userId= userRef.data().email;
             if(userId == this.user.email){
               this.eventSource.push({                
                "allDay": !leavesArray.isHalfDay,
                startTime: leavesArray.from,
                endTime: leavesArray.to,
                status: (LeaveStatus[(Number(leavesArray.status))]).toString(),
                title: leavesArray.reason,
                photoUrl: this.user.photoUrl,
                name: this.user.name,
                reqDate: leavesArray.createdAt,
                Leaveid:leavesArray.leaveId
              })
             }
         });
      })

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

