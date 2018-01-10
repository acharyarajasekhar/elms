import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Leave } from '../../models/leave.model';
import { NotificationService } from '../../providers/notification-service/notification-service';

@IonicPage()
@Component({
  selector: 'page-notifications', 
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
  leaves$:Observable<Leave[]>;
  photoUrl:string = "";
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private notificationService:NotificationService
  ) {
    this.leaves$ = this.notificationService
        .getAllPendingLeaves()
        .snapshotChanges()
        .map(
          changes=>{
          //this.photoUrl = "";//to do
          return changes.map(c=>({
                key:c.payload.key,...c.payload.val()
          }))
        });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationsPage');
    this.photoUrl ==""? this.photoUrl = "http://www.4akb.ru/default-icon.png": this.photoUrl;
  }

  
 changeLeaveStatus(key$,status){
   if(status === 'accept'){
     this.notificationService.acceptleave(key$);
   }
   else if(status === 'decline'){
    this.notificationService.declineLeave(key$);
   }
 }

}
