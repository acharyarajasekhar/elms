import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Leave } from '../../models/leave.model';
import { LeaveStatus } from '../../models/leavestatus.enum';
import { UserServiceProvider } from '../user-service/user-service';
import { AuthServiceProvider } from '../auth-service/auth-service';
import { formatDateUsingMoment } from '../../helper/date-formatter';
//import { Observable } from 'rxjs/Observable';
//import { mergeMap } from 'rxjs/operators';
//import { forkJoin } from "rxjs/observable/forkJoin";
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/mergeMap';

@Injectable()
export class LeaveServiceProvider {
  ukey: string = localStorage.getItem('myId');
  leaveCollection: AngularFirestoreCollection<Leave> = null;
  filteredLeaveCollection: AngularFirestoreCollection<Leave> = null;
  leaveDocument: AngularFirestoreDocument<Leave>;
  snapshot: any;
  team$: any;
  constructor(
    public afs: AngularFirestore,
    public auth: AuthServiceProvider,
    public db: AngularFirestore,
    private userService: UserServiceProvider) {
  }

  createNewLeave(leave: Leave) {
    let userId = JSON.parse(localStorage.getItem('userContext')).email;
    leave.status = LeaveStatus.Requested;
    leave.createdAt = new Date();
    leave.from = new Date(leave.from);
    leave.to = new Date(leave.to);
    leave.isRead = false;
    leave.owner = this.afs.collection("eUsers").doc(userId).ref;
    this.afs.collection('eLeaves').add(leave);
  }

  getLeavesByUser(ukey: string, isManager: boolean) {
    if (isManager) {
      this.leaveCollection = this.afs.collection('eLeaves', ref => {
        return ref.where('status', '==', 0);
      });
    }
    else {
      this.leaveCollection = this.afs.collection('eLeaves', ref => {
        return ref.where('isRead', '==', false).orderBy("from","asc");
      });
    }
    return this.leaveCollection.valueChanges();
  }

  getLeavesByStatusForUser(userId: string, status: number) {
    this.leaveCollection = this.afs.collection('leaves', ref => {
      return ref.where('userId', '==', userId)
        .where('status', '==', status)
        .orderBy('from', 'desc');
    });
    return this.leaveCollection.valueChanges();
  }

  getBadgeCount(isManager: string,emailId:string) {
    if (isManager == "true")
      return this.getLeavesByUser(emailId, true);
    else
      return this.getLeavesByUser(emailId, false);
  }

  getMyLeaveHistory(ukey: string) {
    this.leaveCollection = this.afs.collection('leaves', ref => {
      return ref.where('userId', '==', ukey);
    });
    return this.leaveCollection.valueChanges();
  }

  getLeaveByDuration(isManager: string, teamId: string, startDate?, endDate?, userId?: string) {
    if (isManager == 'true') {
      if (startDate != "" && endDate == "") {
        let unixFrmDt = formatDateUsingMoment(startDate, 'U');
        this.filteredLeaveCollection = this.afs.collection('leaves', ref => {
          return ref.where('unixFrDate', '>=', unixFrmDt)
            .where('managerId', '==', this.ukey)
            .orderBy('unixFrDate', 'asc');
        });
      }
      else {
        this.filteredLeaveCollection = this.afs.collection('leaves', ref => {
          return ref.where('managerId', '==', this.ukey).orderBy('unixFrDate', 'asc');
        });
      }
      return this.filteredLeaveCollection.valueChanges();
    }
    else {
      if (startDate != "" && endDate == "") {
        let unixFrmDt = formatDateUsingMoment(startDate, 'U');
        this.filteredLeaveCollection = this.afs.collection('leaves', ref => {
          return ref.where('unixFrDate', '>=', unixFrmDt)
            .where('teamId', '==', teamId)
            .orderBy('unixFrDate', 'asc');
        });
      }
      else {
        this.filteredLeaveCollection = this.afs.collection('leaves', ref => {
          return ref.where('teamId', '==', teamId).orderBy('unixFrDate', 'asc');
        });
      }
      return this.filteredLeaveCollection.valueChanges();
    }
  }

  getLeaveByDateRange(isManager: boolean, teamId: string, startDate: Date, endDate: Date, userId: string) {
    if (isManager && startDate != null && endDate != null) {
      this.filteredLeaveCollection = this.afs.collection('leaves', ref => {
        return ref.where('from', '>=', startDate)
          //.where('managerId', '==', userId)
          .orderBy('from', 'asc');
      });
    }
    else {
      this.filteredLeaveCollection = this.afs.collection('leaves', ref => {
        return ref.where('from', '>=', startDate)
          //.where('teamId', '==', teamId)
          .orderBy('from', 'asc');
      });
    }
    return this.filteredLeaveCollection.snapshotChanges()
      .map(action => {
        return action.map(snap => {
          const data = snap.payload.doc.data() as Leave;
          const id = snap.payload.doc.id;
          return { id, data };
        })
      });

  }

  getLeavelstByDateRange(isManager: string, teamId: string, startDate: Date, endDate: Date, userId: string) {

    if (isManager == 'true' && startDate != null && endDate != null) {
      this.filteredLeaveCollection = this.afs.collection('leaves', ref => {
        return ref.where('from', '<=', startDate)
          .where('managerId', '==', userId)
          .where('status', '==', 1);

      });
    }
    else {
      this.filteredLeaveCollection = this.afs.collection('leaves', ref => {
        return ref.where('from', '<=', startDate)
          .where('teamId', '==', teamId)
          .where('status', '==', 1);

      });
    }
    return this.filteredLeaveCollection.valueChanges();
  }


  getTdyandTmrwleavelist(isManager: string, teamId: string, startDate: Date, userId: string) {
    var usersCollectionRef = this.db.collection('eUsers').valueChanges();
    usersCollectionRef.subscribe(dd => {
    })
    var fromDTTM = new Date(startDate);
    var leavesCollectionRef = this.db.collection('eLeaves',
      ref => ref
        .where("to", ">=", fromDTTM)
        .where("status", "==", 1)
    ).valueChanges();
    return leavesCollectionRef;
  }

  getExistingleavelist(isManager: string, teamId: string, startDate: Date, userId: string) {
    var usersCollectionRef = this.db.collection('eUsers').valueChanges();
    usersCollectionRef.subscribe(dd => {
    })
    var fromDTTM = new Date(startDate);
    var leavesCollectionRef = this.db.collection('eLeaves',
      ref => ref
        .where("to", ">=", fromDTTM)
        .where("status", "<=", 1)
    ).snapshotChanges();
    return leavesCollectionRef;
  }
}
