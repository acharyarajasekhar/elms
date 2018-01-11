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
          changes.map(c=>{ 
            let result = c.payload.val(); 
            this.getUserDetails(result.requestor);
          });
          return changes.map(c=>({
            key:c.payload.key,...c.payload.val()
          }))
        });
  }

ionViewDidLoad() {
  this.photoUrl ==""? this.photoUrl = "http://www.4akb.ru/default-icon.png": this.photoUrl;
}

getUserDetails(uid :string){
  // this.notificationService.getRequestorDetails(uid).snapshotChanges().subscribe(user=>{
  //   console.log(user.payload.val());
  // });
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
