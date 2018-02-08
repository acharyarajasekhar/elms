import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import * as moment from 'moment';
import { AppContextProvider } from '../../providers/app-context/app-context';
import { LeaveServicev2Provider } from '../../providers/leave-servicev2/leave-servicev2';
import {LeaveStatus} from '../../models/leavestatus.enum'



@IonicPage()
@Component({
  selector: 'page-search-leaves',
  templateUrl: 'search-leaves.html'
})
export class SearchLeavesPage {

  fromDate = new Date().toISOString();
  toDate = new Date().toISOString();
  maxToDate = moment(new Date()).add(90, 'days').format('YYYY-MM-DD');
  minFromDate = moment(new Date()).add(-90, 'days').format('YYYY-MM-DD');



  constructor(private appContext: AppContextProvider,
    private leavesSvc: LeaveServicev2Provider, private alertCtrl: AlertController) {
    this.appContext.searchedLeaves.subscribe(leaves => { console.log(leaves) });
  }

  getMaxFromDate(toDate) {
    return moment(toDate).format('YYYY-MM-DD');
  }

  getMinToDate(fromDate) {
    return moment(fromDate).format('YYYY-MM-DD');
  }

  searchLeave(fromDate, toDate) {
    var from = this.leavesSvc.getDateRange(fromDate);
    var to = this.leavesSvc.getDateRange(toDate);
    this.leavesSvc.searchLeavesByDateRange(from.start, to.end);
  }

  isSearchResultsAvailable() {
    return this.appContext.searchedLeavesCollection && this.appContext.searchedLeavesCollection.length > 0;
  }

  rejectLeave(leaveID: string, info: string) {
    this.leavesSvc.updateLeaveStatus(leaveID,LeaveStatus.Declined ,info);
  }

  acceptLeave(leaveID: any) {
    this.leavesSvc.updateLeaveStatus(leaveID,LeaveStatus.Accepted,"Approved");
  }

  getColor(status) {
    switch (status) {
      case 0:
        return 'gray';
      case 1:
        return 'green';
      case 2:
        return 'red';
      default:
        return 'orange';
    }
  }

  ionViewWillLeave() {
    this.appContext.searchedLeaves.next([]);
  }

  presentPrompt(keyObj: string) {
    let alert = this.alertCtrl.create({
      title: 'Reject Leave',
      message: 'Do you wish to reject this leave request?',
      cssClass: 'alertCustomCss',
      inputs: [
        {
          name: 'comments',
          placeholder: 'Comments'
        }
      ],
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.rejectLeave(keyObj, data.comments);
          }
        }
      ]
    });
    alert.present();
  }

  // MoreInfo(obj: any) {

  //   let leaveObj = {
  //     name: obj.owner.name,
  //     from: obj.from,
  //     to: obj.to,
  //     reason: obj.reason,
  //     photoUrl: obj.owner.photoUrl,
  //     teamId: this.teamId,
  //     ManagerEmail: this.managerId
  //   };
  //   let myModal = this.modalCtrl.create(DetailsviewPage, leaveObj);
  //   myModal.present();
  // }

}
