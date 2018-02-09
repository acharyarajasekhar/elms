import { Component } from '@angular/core';
import { IonicPage, ToastController, ModalController } from 'ionic-angular';
import { NotificationService } from '../../providers/notification-service/notification-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Leave } from '../../models/leave.model';
import { DetailsviewPage } from '../detailsview/detailsview';
import { AppContextProvider } from '../../providers/app-context/app-context';
import { LeaveServicev2Provider } from '../../providers/leave-servicev2/leave-servicev2';
import * as moment from 'moment';
import { ToastMessageProvider } from '../../providers/toast-message/toast-message';

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
    private leavesSvc:LeaveServicev2Provider,
    public toastMP: ToastMessageProvider,
    public modalCtrl: ModalController,
    private appContext: AppContextProvider
  ) {
    this.bindNotificationList();
  }

  bindNotificationList(){
    var from = moment(new Date()).startOf('day').toDate();
    var to = moment(new Date()).add(90, 'days').endOf('day').toDate();
    this.leavesSvc.searchLeavesByDateRange(from, to);
  }

  ionViewWillLeave() {
    this.appContext.searchedLeaves.next([]);
  }

  //left drag ~> positive value
  //right drag ~> negative value
  dragEvent(item,leaveId:string,userId:string) {
    let percent = item.getOpenAmount();
    console.log(this.appContext.myProfileObject.isManager);
    if (percent < -130) {
      if(this.appContext.myProfileObject.isManager){
        this.notificationService.acceptleave(leaveId,true,userId);
        this.toastMP.showToast('Leave request accepted succesfully',false);
      }
      else{
        this.notificationService.archieveLeave(leaveId);
        this.toastMP.showToast('Archived',false);
      }
    }
    if (percent > 130) {
      if(this.appContext.myProfileObject.isManager){
        this.notificationService.declineLeave(leaveId,true,userId);
        this.toastMP.showToast('Leave request rejected succesfully',false);
      }
      else{
        this.notificationService.archieveLeave(leaveId);
        this.toastMP.showToast('Archived',false);
      }
    }
  }

  openModal(leave:any) {
    let leaveObj = { 
                      userId: leave.owner.userId, 
                      name: leave.owner.name, 
                      from: leave.from, 
                      to: leave.to, 
                      status:leave.status,
                      reason: leave.reason, 
                      photoUrl:leave.owner.photoUrl
                    };
    let myModal = this.modalCtrl.create(DetailsviewPage,leaveObj);
    myModal.present();
  }
}
