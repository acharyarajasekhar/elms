import { Component } from '@angular/core';
import { IonicPage, ToastController, ModalController } from 'ionic-angular';
import { NotificationService } from '../../providers/notification-service/notification-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Leave } from '../../models/leave.model';
import { DetailsviewPage } from '../detailsview/detailsview';
import * as _ from 'lodash';
import { AppContextProvider } from '../../providers/app-context/app-context';
import { LeaveServicev2Provider } from '../../providers/leave-servicev2/leave-servicev2';

@IonicPage()
@Component({
  selector: 'page-notifications', 
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
  leaves$: any[]=[];
  photoUrl: string;
  userContext: any;
  userId: string;
  uid: string;
  managerUserId: string;
  userName: string;
  isManagerRole: string;
  constructor(
    private notificationService:NotificationService,
    public auth: AuthServiceProvider,
    private leaveService:LeaveServicev2Provider,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    private appContext: AppContextProvider
  ) {
    this.bindNotificationList();
  }

  bindNotificationList(){
    this.leaveService.loadNotification();
  }

  ionViewWillLeave() {
    this.appContext.notificationLeaves.next([]);
  }

  //left drag ~> positive value
  //right drag ~> negative value
  // dragEvent(item,leaveId:string,mgrId?:string) {
  //   let percent = item.getOpenAmount();
  //   console.log(percent);
  //   console.log(leaveId);
  //   if (percent < -130) {
  //     if(this.isManagerRole)
  //       this.notificationService.acceptleave(leaveId,true,mgrId);
  //     else
  //       this.notificationService.archieveLeave(leaveId);
  //   }
  //   if (percent > 130) {
  //     if(this.isManagerRole)
  //       this.notificationService.declineLeave(leaveId,true,"");
  //     else
  //       this.notificationService.archieveLeave(leaveId);
  //   }
  // }

  // swipeEvent(event,keyObj:string,managerId?:string){
  //   if (event.direction == 2){ //(2)swipe left direction ~ reject
  //     if(!this.isManagerRole && this.isManagerRole == 'true')
  //       this.notificationService.declineLeave(keyObj,true,"");
  //     else
  //       this.notificationService.declineLeave(keyObj,false,"");
  //   }
  //   if (event.direction == 4){ //(4)swipe right direction ~ accept
  //     if(!this.isManagerRole && this.isManagerRole == 'false')
  //       this.notificationService.acceptleave(keyObj,true,managerId);
  //     else
  //       this.notificationService.acceptleave(keyObj,false);
  //   } 
  // }

  // rejectLeave(keyObj:string){
  //   if(this.isManagerRole == 'true'){
  //     this.notificationService.declineLeave(keyObj,true,"");
  //     this.showToast('Leave request rejected succesfully');
  //   }   
  //   else{
  //     this.notificationService.declineLeave(keyObj,false,"");
  //     this.showToast('Archived');
  //   }
  // }

  // acceptLeave(keyObj:string){
  //   if(this.isManagerRole == 'true'){
  //     this.notificationService.acceptleave(keyObj,true,this.uid);
  //     this.showToast('Leave request accepted succesfully');
  //   }   
  //   else{
  //     this.notificationService.acceptleave(keyObj,false);
  //     this.showToast('Archived');
  //   }
  // }

  // readOnly(keyObj,userId){
  //   this.notificationService.archieveLeave(keyObj);
  // }

  // showToast(alert_message:string){
  //   let toast = this.toastCtrl.create({
  //     message: alert_message,
  //     duration: 2000,
  //     position: 'bottom'
  //   }); 
  //   toast.present(toast);
  // }

  // openModal(leave:Leave) {
  //   let leaveObj = { 
  //                     userId: leave.userId, 
  //                     name: leave.name, 
  //                     from: leave.from, 
  //                     to: leave.to, 
  //                     status:leave.status,
  //                     reason: leave.reason, 
  //                     photoUrl:leave.photoUrl
  //                   };
  //   let myModal = this.modalCtrl.create(DetailsviewPage,leaveObj);
  //   myModal.present();
  // }
}
