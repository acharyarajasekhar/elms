import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { NotificationService } from '../../providers/notification-service/notification-service';
import { LeaveServiceProvider } from '../../providers/leave-service/leave-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Leave } from '../../models/leave.model';
import * as _ from "lodash";
import * as firebase from "firebase";

@IonicPage()
@Component({
  selector: 'page-notifications', 
  templateUrl: 'notifications.html',
})
export class NotificationsPage implements OnInit{
  leaves$:any;
  photoUrl:string;
  UserContext:any;
  userId:string;
  loggedInUserId:string = firebase.auth().currentUser.uid;
  managerUserId:string;
  userName:string;
  isManagerRole:string;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private notificationService:NotificationService,
    public auth: AuthServiceProvider,
    private leaveService:LeaveServiceProvider,
    public toastCtrl: ToastController
  ) {
    this.isManagerRole = localStorage.getItem('isManagerRole');
    this.bindNotificationList();
  }

  bindNotificationList(){
    if((this.isManagerRole!= undefined || this.isManagerRole == "") && this.isManagerRole == "true")
      this.managerLeaveView(this.loggedInUserId);
    else
      this.userLeaveView(this.loggedInUserId);
  }

  async userLeaveView(user:string){
    await this.leaveService
              .getLeavesByUser(user)
              .subscribe(result=>{
                  let unSorted:Leave[] = _.filter(result, { 
                                                        status: 0 ,//pending leaves
                                                        requestor : user,
                                                        isRead: false
                                                     });                                            
                  this.leaves$ = _.orderBy(unSorted, ['from'], ['asc']); 
        });
  }

  managerLeaveView(managerId){
   //to-do
  }

  ionViewDidLoad() {
    this.userName = this.navParams.get('name');
    this.navParams.get('photoUrl') == ""?
          this.photoUrl = "http://www.4akb.ru/default-icon.png": 
          this.photoUrl = this.navParams.get('photoUrl');
  }

  swipeEvent(event,keyObj){
    if (event.direction == 2){ //(2)swipe left direction ~ reject
      if(!this.isManagerRole && this.isManagerRole == 'true')
        this.notificationService.declineLeave(keyObj,true);
      else
        this.notificationService.declineLeave(keyObj,false);
    }
    if (event.direction == 4){ //(4)swipe right direction ~ accept
      if(!this.isManagerRole && this.isManagerRole == 'false')
        this.notificationService.acceptleave(keyObj,true);
      else
        this.notificationService.acceptleave(keyObj,false);
    } 
  }

  rejectLeave(keyObj){
    if(this.isManagerRole == 'true'){
      this.notificationService.declineLeave(keyObj,true);
      this.showToast('Leave request rejected succesfully');
    }   
    else{
      this.notificationService.declineLeave(keyObj,false);
      this.showToast('Archived');
    }
  }

  acceptLeave(keyObj){
    if(this.isManagerRole == 'true'){
      this.notificationService.acceptleave(keyObj,true);
      this.showToast('Leave request accepted succesfully');
    }   
    else{
      this.notificationService.acceptleave(keyObj,false);
      this.showToast('Archived');
    }
  }

  readOnly(keyObj){
    this.notificationService.archieveLeave(keyObj);
    this.showToast('Archived');
  }

  ngOnInit(){

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
