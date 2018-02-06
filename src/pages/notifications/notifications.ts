import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { NotificationService } from '../../providers/notification-service/notification-service';
import { LeaveServiceProvider } from '../../providers/leave-service/leave-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Leave } from '../../models/leave.model';
import { DetailsviewPage } from '../detailsview/detailsview';
import * as _ from 'lodash';
@IonicPage()
@Component({
  selector: 'page-notifications', 
  templateUrl: 'notifications.html',
})
export class NotificationsPage implements OnInit {
  leaves$: any[]=[];
  photoUrl: string;
  userContext: any;
  userId: string;
  uid: string;
  managerUserId: string;
  userName: string;
  isManagerRole: string;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private notificationService:NotificationService,
    public auth: AuthServiceProvider,
    private leaveService:LeaveServiceProvider,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController
  ) {
    this.userContext = JSON.parse(localStorage.getItem('userContext'));
    this.isManagerRole = this.userContext.isManager;
    this.uid = this.userContext.email;
    this.bindNotificationList();
  }

  bindNotificationList(){
    if(this.isManagerRole)
      this.pendingLeavesView(this.uid,true);
    else
      this.pendingLeavesView(this.uid,false);
  }

  async pendingLeavesView(userid: string, isManager: boolean) {
    await this.leaveService
      .getLeavesByUser(userid, isManager)
      .subscribe(result => {
        if(isManager){          
          result.forEach((lvRef:any)=>{
            lvRef.data.owner.get().then(userRef=>{
              var user = userRef.data();
              if (user.manager != null && user.manager != '') {
                user.manager.get()
                  .then(managerRef => {
                    user.manager = managerRef.data();
                  });
                if (user.manager.id == this.uid) {
                  //lvRef.data.owner = user;
                  console.log(lvRef);
                  let lvItem = lvRef;
                  lvItem.photoUrl = userRef.data().photoUrl;
                  lvItem.name = userRef.data().name;
                  this.leaves$.push(lvItem);
                }
              }
            })
          });
        }
        else{
          result.forEach((lvRef:any)=>{
            lvRef.data.owner.get().then(userRef=>{
              if(userRef.data().email == userid){
                console.log(lvRef);
                let lvItem = lvRef;
                lvItem.photoUrl = userRef.data().photoUrl;
                lvItem.name = userRef.data().name;
                this.leaves$.push(lvItem);
              }
            })
          });
        }
      }, err => {
        console.log(err);
        this.showToast(err);
      });
  }

  ionViewDidLoad() {
  }

  //left drag ~> positive value
  //right drag ~> negative value
  dragEvent(item,leaveId:string,mgrId?:string) {
    let percent = item.getOpenAmount();
    console.log(percent);
    console.log(leaveId);
    if (percent < -130) {
      if(this.isManagerRole)
        this.notificationService.acceptleave(leaveId,true,mgrId);
      else
        this.notificationService.archieveLeave(leaveId);
    }
    if (percent > 130) {
      if(this.isManagerRole)
        this.notificationService.declineLeave(leaveId,true,"");
      else
        this.notificationService.archieveLeave(leaveId);
    }
  }

  swipeEvent(event,keyObj:string,managerId?:string){
    if (event.direction == 2){ //(2)swipe left direction ~ reject
      if(!this.isManagerRole && this.isManagerRole == 'true')
        this.notificationService.declineLeave(keyObj,true,"");
      else
        this.notificationService.declineLeave(keyObj,false,"");
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
      this.notificationService.declineLeave(keyObj,true,"");
      this.showToast('Leave request rejected succesfully');
    }   
    else{
      this.notificationService.declineLeave(keyObj,false,"");
      this.showToast('Archived');
    }
  }

  acceptLeave(keyObj:string){
    if(this.isManagerRole == 'true'){
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
                      status:leave.status,
                      reason: leave.reason, 
                      photoUrl:leave.photoUrl
                    };
    let myModal = this.modalCtrl.create(DetailsviewPage,leaveObj);
    myModal.present();
  }
}
