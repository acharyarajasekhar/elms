import { Injectable } from '@angular/core';
import { UserServiceV2Provider } from '../user-service-v2/user-service-v2';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { AppContextProvider } from '../app-context/app-context';
import { EmailServiceProvider } from '../email-service/email-service';
import * as moment from 'moment';

@Injectable()
export class LeaveServicev2Provider {

  private emailIds = [];

  constructor(private userSvc: UserServiceV2Provider,
    private store: AngularFirestore,
    private appContext: AppContextProvider, private emailSP: EmailServiceProvider) {
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
    var tomorrow = moment(new Date()).add(1, 'days');
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

  private getMyLeaves(from: Date) {
    return this.store.collection('eLeaves', ref => ref
      .where('to', ">=", from)
      .where('owner', "==", this.store.doc('eUsers/' + this.appContext.myProfileObject.email).ref))
      .snapshotChanges()
  }

  public searchLeavesByDateRange(from: Date, to: Date) {
    this.appContext.searchDateRange = {
      start: from,
      end: to
    };
    this.updateSearchResults(this.getLeaves(this.appContext.searchDateRange.start));
  }

  private updateSearchResults(source: Observable<any>) {
    source.subscribe(results => {
      this.appContext.searchedLeaves.next([]);
      if (results && results.length > 0) {
        var resultitems = [];
        results.forEach((leave: any, lIndex, lArray) => {
          var leaveItem = leave.payload.doc.data();
          leaveItem.leaveId = leave.payload.doc.id;
          resultitems.push(leaveItem);
          if (lIndex == lArray.length - 1) {
            this.updateSubject(resultitems, this.appContext.searchDateRange, this.appContext.searchedLeaves);
          }
        });
      }
    });
  }

  private searchMyLeavesByDateRange(from: Date, to: Date) {
    this.appContext.searchDateRange = {
      start: from,
      end: to
    };
    this.updateSearchResults(this.getMyLeaves(this.appContext.searchDateRange.start));
  }

  public getMyLeavesByMonth(month: string) {
    var startDate = moment(month).startOf('month').toDate();
    var endDate = moment(month).endOf('month').toDate();
    this.searchMyLeavesByDateRange(startDate, endDate)
  }

  public updateLeaveStatus(Id: string, newStatus: number, comments: string) {

    this.store.doc('eLeaves/' + Id).update({ status: newStatus, modifiedAt: new Date(), ManagerComments: comments })
      .then(status => {
        this.emailSP.trigger(Id, newStatus);
      }).catch(err => { console.log(err) });
  }

}
