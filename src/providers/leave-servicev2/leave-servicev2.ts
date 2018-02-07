import { Injectable } from '@angular/core';
import { UserServiceV2Provider } from '../user-service-v2/user-service-v2';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { AppContextProvider } from '../app-context/app-context';
import * as momento from 'moment';

@Injectable()
export class LeaveServicev2Provider {

  private emailIds = [];

  constructor(private userSvc: UserServiceV2Provider,
    private store: AngularFirestore,
    private appContext: AppContextProvider) {
    this.appContext.myTeamMembers.subscribe(myTeamMembers => {
      this.emailIds = myTeamMembers;
    })
    this.getTodaysLeaves();
    this.getTomorrowsLeaves();
    this.appContext.searchedLeaves.next([]);
  }

  public getDateRange(date) {
    return {
      start: new Date(new Date(date).setHours(0, 0, 0, 0)),
      end: new Date(new Date(date).setHours(23, 59, 59, 0))
    }
  }

  private getTodaysLeaves() {
    var today = new Date();
    var range = this.getDateRange(today);
    this.getApprovedLeaves(range.start)
      .subscribe(leaves => {
        this.appContext.todaysLeaves.next([]);
        this.updateSubject(leaves, range, this.appContext.todaysLeaves);
      })
  }

  private updateSubject(leaves: {}[], range: { start: Date; end: Date; }, subject: Subject<any>) {
    if (leaves && leaves.length > 0) {
      var results = [];
      leaves.forEach((leave: any, lIndex, lArray) => {
        if (leave.from <= range.end) {
          results.push(leave);
        }
        if (lIndex == lArray.length - 1) {
          subject.next(results);
        }
      });
    }
  }

  private getTomorrowsLeaves() {
    var tomorrow = momento(new Date()).add(1, 'days');
    var range = this.getDateRange(tomorrow);
    this.getApprovedLeaves(range.start)
      .subscribe(leaves => {
        this.appContext.tomorrowsLeaves.next([]);
        this.updateSubject(leaves, range, this.appContext.tomorrowsLeaves);
      })
  }

  private getApprovedLeaves(from: Date, status: number = 1) {
    return this.store.collection('eLeaves', ref => ref
      .where('to', ">=", from)
      .where("status", "==", status))
      .valueChanges()
  }

  private getLeaves(from: Date) {
    return this.store.collection('eLeaves', ref => ref
      .where('to', ">=", from))
      .snapshotChanges()
  }

  public searchLeavesByDateRange(from: Date, to: Date) {
    this.appContext.searchDateRange = {
      start: from,
      end: to
    };
    this.getLeaves(this.appContext.searchDateRange.start).subscribe(results => {
          if (results && results.length > 0) {
      var resultitems = [];
      results.forEach((leave: any, lIndex, lArray) => {
        var leavesArray = leave.payload.doc.data();
        leavesArray.leaveId = leave.payload.doc.id;
          resultitems.push(leavesArray);
      });
    }
      this.appContext.searchedLeaves.next([]);
      this.updateSubject(resultitems, this.appContext.searchDateRange, this.appContext.searchedLeaves);
    })
  }



  public updateLeaveStatus(Id:string,toUpdate:number)
  {
    this.store.doc('eLeaves/'+ Id).update({status:toUpdate,modifiedAt:new Date()})
    .then(status=>{
      // this.emailSvc.trigger(leaveId, 1);
    }).catch(err=>{console.log(err)});
  }

}
