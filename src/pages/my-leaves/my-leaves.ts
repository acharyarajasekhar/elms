import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LeaveServicev2Provider } from '../../providers/leave-servicev2/leave-servicev2';
import { AppContextProvider } from '../../providers/app-context/app-context';
import { LeaveStatus } from '../../models/leavestatus.enum';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-my-leaves',
  templateUrl: 'my-leaves.html',
})
export class MyLeavesPage {

  eventSource = [];
  viewTitle: string;
  selectedDay = new Date();

  calendarDefaults = {
    mode: 'month',
    currentDate: new Date()
  };

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private leaveSvc: LeaveServicev2Provider,
    private appContext: AppContextProvider) {

    this.appContext.myProfile.subscribe(profile => {
      this.updateSourceEvents();
    });

    this.appContext.searchedLeaves.subscribe(leaves => {
      this.eventSource = [];
      leaves.forEach(leave => {
        this.eventSource.push({
          "allDay": !leave.isHalfDay,
          startTime: leave.from,
          endTime: leave.to,
          status: (LeaveStatus[(Number(leave.status))]),
          title: leave.reason,
          photoUrl: this.appContext.myProfileObject.photoUrl,
          name: this.appContext.myProfileObject.name,
          reqDate: leave.createdAt,
          Leaveid: leave.leaveId
        })
      })
    })

  }

  openNewLeave() {
    this.navCtrl.push("NewLeavePage");
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
    this.updateSourceEvents();
  }

  onEventSelected(event) { }

  onTimeSelected(ev) { this.selectedDay = ev.selectedTime; }

  updateSourceEvents() {
    this.leaveSvc.getMyLeavesByMonth(this.viewTitle);
  }

  ionViewWillLeave() {
    this.appContext.searchedLeaves.next([]);
  }

}

