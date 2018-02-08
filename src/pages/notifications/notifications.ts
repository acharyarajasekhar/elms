import { Component } from '@angular/core';
import { IonicPage, ToastController, ModalController } from 'ionic-angular';
import { NotificationService } from '../../providers/notification-service/notification-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Leave } from '../../models/leave.model';
import { DetailsviewPage } from '../detailsview/detailsview';
import { AppContextProvider } from '../../providers/app-context/app-context';
import { LeaveServicev2Provider } from '../../providers/leave-servicev2/leave-servicev2';
import * as moment from 'moment';

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
    public toastCtrl: ToastController,
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
    if (percent < -130) {
      if(localStorage.getItem('isManager') == 'true'){
        this.notificationService.acceptleave(leaveId,true,userId);
        this.showToast('Leave request accepted succesfully');
      }
      else{
        this.notificationService.archieveLeave(leaveId);
        this.showToast('Archived');
      }
    }
    if (percent > 130) {
      if(localStorage.getItem('isManager') == 'true'){
        this.notificationService.declineLeave(leaveId,true,userId);
        this.showToast('Leave request rejected succesfully');
      }
      else{
        this.notificationService.archieveLeave(leaveId);
        this.showToast('Archived');
      }
    }
  }

  showToast(alert_message:string){
    let toast = this.toastCtrl.create({
      message: alert_message,
      duration: 2000,
      position: 'bottom'
    }); 
    toast.present(toast);
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
