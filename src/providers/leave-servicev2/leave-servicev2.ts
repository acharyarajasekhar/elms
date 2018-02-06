import { Injectable } from '@angular/core';
import { UserServiceV2Provider } from '../user-service-v2/user-service-v2';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { retry } from 'rxjs/operator/retry';

@Injectable()
export class LeaveServicev2Provider {

  todaysLeaves = new Subject<any>();
  tomorrowsLeaves = new Subject<any>();
  searchedLeaves = new Subject<any>();

  constructor(private userSvc: UserServiceV2Provider,
    private store: AngularFirestore) {
    this.getTodaysLeaves();
    this.getTomorrowsLeaves();
    this.searchedLeaves.next([]);
  }

  private getDateRange(date) {
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
        this.updateSubject(leaves, range, this.todaysLeaves);
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
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var range = this.getDateRange(tomorrow);
    this.getApprovedLeaves(range.start)
      .subscribe(leaves => {
        this.updateSubject(leaves, range, this.tomorrowsLeaves);
      })
  }

  private getApprovedLeaves(from: Date) {
    return this.store.collection('eLeaves', ref => ref
      .where('to', ">=", from)
      .where("status", "==", 1))
      .valueChanges()
  }

}
