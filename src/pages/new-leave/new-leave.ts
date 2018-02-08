import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import * as moment from 'moment';
import { LeaveServicev2Provider } from '../../providers/leave-servicev2/leave-servicev2';
import { leave } from '@angular/core/src/profile/wtf_impl';

@IonicPage()
@Component({
  selector: 'page-new-leave',
  templateUrl: 'new-leave.html',
})
export class NewLeavePage {

  leave: any = {
    from: new Date().toISOString(),
    to: new Date().toISOString(),
    isHalfDay: false,
    reason: "",
    status: 0
  };

  maxToDate = moment(new Date()).add(90, 'days').format('YYYY-MM-DD');
  minFromDate = moment(new Date()).add(0, 'days').format('YYYY-MM-DD');

  getMaxFromDate(toDate) {
    return moment(this.leave.to).format('YYYY-MM-DD');
  }

  getMinToDate(fromDate) {
    return moment(this.leave.from).format('YYYY-MM-DD');
  }

  createLeave() {
    if (this.leave.isHalfDay) {
      this.leave.to = this.leave.from;
    }    
    this.leaveSvc.createLeave(this.leave);
  }

  constructor(private leaveSvc: LeaveServicev2Provider) { }
}
