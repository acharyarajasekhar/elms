import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { NotificationService } from '../../providers/notification-service/notification-service';
import { LeaveServiceProvider } from '../../providers/leave-service/leave-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Leave } from '../../models/leave.model';
import { DetailsviewPage } from '../detailsview/detailsview';

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
  uid:string = localStorage.getItem('myId');
  managerUserId:string;
  userName:string;
  isManagerRole:string;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private notificationService:NotificationService,
    public auth: AuthServiceProvider,
    private leaveService:LeaveServiceProvider,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController
  ) {
    this.isManagerRole = localStorage.getItem('isManagerRole');
    this.bindNotificationList();
  }

  bindNotificationList(){
    if((this.isManagerRole!= undefined || this.isManagerRole == "") && this.isManagerRole == "true")
      this.pendingLeavesView(this.uid,true);
    else
      this.pendingLeavesView(this.uid,false);
  }

  async pendingLeavesView(user:string, isManager:boolean){
    await this.leaveService
              .getLeavesByUser(user,isManager)
              .subscribe(result=>{
              this.leaves$ = result;
        },err=>{
          console.log(err);
          this.showToast(err);
        });
  }

  ionViewDidLoad() {
  }

  swipeEvent(event,keyObj:string,managerId?:string){
    if (event.direction == 2){ //(2)swipe left direction ~ reject
      if(!this.isManagerRole && this.isManagerRole == 'true')
        this.notificationService.declineLeave(keyObj,true,managerId);
      else
        this.notificationService.declineLeave(keyObj,false);
    }
    if (event.direction == 4){ //(4)swipe right direction ~ accept
      if(!this.isManagerRole && this.isManagerRole == 'false')
        this.notificationService.acceptleave(keyObj,true,managerId);
      else
        this.notificationService.acceptleave(keyObj,false);
    } 
  }

  rejectLeave(keyObj:string){
    if(this.isManagerRole == 'true'){
      //let managerId = localStorage.getItem('myManager');
      this.notificationService.declineLeave(keyObj,true,this.uid);
      this.showToast('Leave request rejected succesfully');
    }   
    else{
      this.notificationService.declineLeave(keyObj,false);
      this.showToast('Archived');
    }
  }

  acceptLeave(keyObj:string){
    if(this.isManagerRole == 'true'){
      //let managerId = localStorage.getItem('myManager');
      this.notificationService.acceptleave(keyObj,true,this.uid);
      this.showToast('Leave request accepted succesfully');
    }   
    else{
      this.notificationService.acceptleave(keyObj,false);
      this.showToast('Archived');
    }
  }

  readOnly(keyObj,userId){
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

  openModal(leave:Leave) {
    let leaveObj = { 
                      userId: leave.userId, 
                      name: leave.name, 
                      from: leave.from, 
                      to: leave.to, 
                      reason: leave.reason, 
                      photoUrl:leave.photoUrl
                    };
    let myModal = this.modalCtrl.create(DetailsviewPage,leaveObj);
    myModal.present();
  }
}
