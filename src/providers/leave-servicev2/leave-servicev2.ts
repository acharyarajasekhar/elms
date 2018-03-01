import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { AppContextProvider } from '../app-context/app-context';
import { EmailServiceProvider } from '../email-service/email-service';
import * as moment from 'moment';
import { ToastMessageProvider } from '../toast-message/toast-message';

@Injectable()
export class LeaveServicev2Provider {

  constructor(
    private store: AngularFirestore,
    private appContext: AppContextProvider,
    private emailSP: EmailServiceProvider, 
    private toastMP: ToastMessageProvider) {
    this.appContext.myAccount.subscribe(account => {      
      if(account) {
        this.initHome();
      }
    })
    this.initHome();
  }

  private initHome() {
    //console.log('Hello');
    console.log(this.appContext.myProfileObject);
    this.getTodaysLeaves();
    this.getTomorrowsLeaves();
    this.appContext.searchedLeaves.next([]);
  }
  public getTeams() {
    return this.store.collection('eTeam', ref => ref)
      .valueChanges()
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

  private getUnReadNotification(from: Date) {
    return this.store.collection('eLeaves', ref => {
      return ref.where('to', ">=", from)
                .where('isRead','==',false)
                //.orderBy('createdAt', 'asc')
    })
    .snapshotChanges()
  }

  private getMyLeaves(from: Date) {
    return this.store.collection('eLeaves', ref => ref
      .where('to', ">=", from)
      .where('owner', "==", this.store.doc('eUsers/' + this.appContext.myProfileObject.email).ref))
      .snapshotChanges()
  }
          
  public searchLeavesByDateRange(from: Date, to: Date,currsubject: Subject<any>) {
    this.appContext.searchDateRange = {
      start: from,
      end: to
    };
    this.updateSearchResults(this.getLeaves(this.appContext.searchDateRange.start),currsubject);
  }

  private updateSearchResults(source: Observable<any>,InvokeSubject:Subject<any>) {
    source.subscribe(results => {
      //this.appContext.searchedLeaves.next([]);
      InvokeSubject.next([]);
      if (results && results.length > 0) {
        var resultitems = [];
        results.forEach((leave: any, lIndex, lArray) => {
          var leaveItem = leave.payload.doc.data();
          leaveItem.leaveId = leave.payload.doc.id;
          resultitems.push(leaveItem);
          if (lIndex == lArray.length - 1) {
            //this.updateSubject(resultitems, this.appContext.searchDateRange, this.appContext.searchedLeaves);
            this.updateSubject(resultitems, this.appContext.searchDateRange, InvokeSubject);
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
    this.updateSearchResults(this.getMyLeaves(this.appContext.searchDateRange.start),this.appContext.myLeaves);
  }

  public getMyLeavesByMonth(month: string) {
    var startDate = moment(month).startOf('month').toDate();
    var endDate = moment(month).endOf('month').toDate();
    this.searchMyLeavesByDateRange(startDate, endDate)
  }

  public updateLeaveStatus(Id: string, newStatus: number, comments: string) {
    this.store.doc('eLeaves/' + Id).update({ status: newStatus,isRead: true, modifiedAt: new Date(), managerComments: comments})
      .then(status => {
        if(newStatus === 1){
          this.toastMP.showToast("Leave request accepted successfully!", false);
        }
        else if(newStatus === 2){
          this.toastMP.showToast("Leave request rejected successfully!", true);
        }
        this.emailSP.trigger(Id, newStatus);
      }).catch(err => { this.toastMP.showToast(err, true) });
  }

  private addLeave(leave) {
    this.store.collection('eLeaves').add(leave)
      .then(result => {
        this.emailSP.trigger(result.id, 0);
        this.toastMP.showToast("Leave request submitted...", false);
      }).catch(err => { console.log(err) });
  }

  public createLeave(leave): Observable<any> {

    if(!(this.appContext.myProfileObject && this.appContext.myProfileObject.email))
    {
      this.toastMP.showToast("User context is empty...", true);
      return;
    }

    leave.from = moment(leave.from).startOf('day').toDate();
    leave.to = moment(leave.to).endOf('day').toDate();
    leave.createdAt = new Date();
    leave.isRead = false;
    leave.owner = this.store.doc('eUsers/' + this.appContext.myProfileObject.email).ref;

    return new Observable(observer => {
      var sub = this.store.collection('eLeaves', ref => ref
        .where('owner', "==", leave.owner)
        .where('to', ">=", leave.from))
        .valueChanges()
        .subscribe(results => {
          sub.unsubscribe();

          var overlap = results.filter((item: any) => item.from <= leave.to && (item.status == 0 || item.status == 1));
          console.log(overlap);
          if (overlap && overlap.length > 0) {
            this.toastMP.showToast("This leave request is overlapping with other request...", true);
          } else {
            this.addLeave(leave);
            observer.next({});
            observer.complete();
          }
        })
    });
  }

  public markAsRead(leaveId: string) {
    this.store.doc('eLeaves/' + leaveId).update({ isRead: true, modifiedAt: new Date() })
      .then(status => {
        console.log("Marked as read...");
      }).catch(err => { this.toastMP.showToast(err, true) });
  }

  /*****************NOTIFICATION*******************/
  public getNotifications(from: Date, to: Date,currsubject: Subject<any>) {
    this.appContext.searchDateRange = {
      start: from,
      end: to
    };
    this.updateNotificationResult(this.getUnReadNotification(this.appContext.searchDateRange.start),currsubject);
  }

  private updateNotificationResult(source: Observable<any>,InvokeSubject:Subject<any>) {
    source.subscribe(results => {
      InvokeSubject.next([]);
      if (results && results.length > 0) {
        var resultitems = [];
        results.forEach((leave: any, lIndex, lArray) => {
          var leaveItem = leave.payload.doc.data();
          leaveItem.leaveId = leave.payload.doc.id;
          resultitems.push(leaveItem);
          if (lIndex == lArray.length - 1) {
            this.updateSubject(resultitems, this.appContext.searchDateRange, InvokeSubject);
          }
        });
      }
    });
  }
  /*************************************************/
}
