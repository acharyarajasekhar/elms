import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { DetailsviewPage } from '../detailsview/detailsview';
import { AppContextProvider } from '../../providers/app-context/app-context';
import { LeaveServicev2Provider } from '../../providers/leave-servicev2/leave-servicev2';
import * as moment from 'moment';
import { ToastMessageProvider } from '../../providers/toast-message/toast-message';
import { commentsController } from '../../components/controllers/comments-controller';

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

  constructor(
    private leavesSvc: LeaveServicev2Provider,
    public toastMP: ToastMessageProvider,
    public modalCtrl: ModalController,
    private alertCtrl: commentsController,
    private appContext: AppContextProvider) {

    var from = moment(new Date()).startOf('day').toDate();
    var to = moment(new Date()).add(90, 'days').endOf('day').toDate();
    //this.leavesSvc.searchLeavesByDateRange(from, to,this.appContext.searchedLeaves);
    this.leavesSvc.getNotifications(from, to,this.appContext.notificationLeaves);
  }

  ionViewWillLeave() {
    this.appContext.searchedLeaves.next([]);
  }

  approveLeave(leaveId) {
    this.leavesSvc.updateLeaveStatus(leaveId, 1, "Approved");
  }

  declineLeave(leaveId) {
    let Modaltitle = "Reject Leave";
    let Modalmsg = "Do you wish to reject this leave request?";
    this.alertCtrl.presentPrompt(leaveId, Modaltitle, Modalmsg, 2);
  }

  markAsRead(leaveId) {
    this.leavesSvc.markAsRead(leaveId);
  }

  onSwipe(leave) {
    if (this.canShowClear(leave)) {
      this.markAsRead(leave.leaveId);
    } else {
      this.approveLeave(leave.leaveId);
    }
  }

  canShowClear(leave) {
    return leave.isMyLeave && !leave.isRead && !this.canShowApproveDecline(leave);
  }

  canShowApproveDecline(leave) {
    return !leave.isMyLeave && (leave.owner.manager.email == this.appContext.myProfileObject.email);
  }

  openModal(leave: any) {
    console.log(leave);
    let leaveObj = {
      name: leave.owner.name,
      from: leave.from,
      to: leave.to,
      reason: leave.reason,
      photoUrl: leave.owner.photoUrl
    };
    let myModal = this.modalCtrl.create(DetailsviewPage, leaveObj);
    myModal.present();
  }
}
