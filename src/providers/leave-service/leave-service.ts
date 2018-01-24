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
    private userService: UserServiceProvider) {
  }

  ////Author (Asif Iqbal Khan)
  ////All date data types are passed as locale date format.
  ////And stored as timestamp in firestore DB
  ////(unixFrDate) && (unixToDate) are used for sorting and searching 
  ////Any change in date formatting will cause break in behaviour
  createLeave(leave: Leave) {
    let frDt = leave.from;//-------------------------------------> original string format (2018-03-17)
    let localeFrmDt = formatDateUsingMoment(frDt, "L");//---------> ~> MM/DD/YYYY
    let toDt = leave.to;
    let localeToDt = formatDateUsingMoment(toDt, "L");//----------> ~> MM/DD/YYYY
    leave.requestor = this.ukey;
    leave.status = LeaveStatus.Requested;
    leave.createdAt = new Date();//------------------------------> locale date format 
    leave.from = new Date(leave.from);//-------------------------> string ~> locale date format 
    leave.to = new Date(leave.to);//-----------------------------> string ~> locale date format
    leave.unixFrDate = formatDateUsingMoment(localeFrmDt, "U");//-> string ~> unix date format
    leave.unixToDate = formatDateUsingMoment(localeToDt, "U");//--> string ~> unix date format
    leave.isRead = false;
    leave.userId = this.ukey;
    leave.name = localStorage.getItem('myName');
    leave.photoUrl = localStorage.getItem('myphotoUrl');
    leave.teamId = localStorage.getItem('myTeam');
    this.userService.getMyManager(this.ukey).subscribe(obj => {
      leave.managerId = obj.manager;
      this.afs.collection('leaves').add(leave);
    });
  }

  getLeavesByUser(ukey: string, isManager: boolean) {
    if (isManager) {
      this.leaveCollection = this.afs.collection('leaves', ref => {
        return ref.where('managerId', '==', ukey)
          .where('status', '==', 0)
          .orderBy('unixFrDate', 'asc');
      });
    }
    else {
      this.leaveCollection = this.afs.collection('leaves', ref => {
        return ref.where('isRead', '==', false)
          .where('userId', '==', ukey)
          .orderBy('unixFrDate', 'asc');
      });
    }
    //return leavecollection as Observable
    return this.leaveCollection.snapshotChanges()
      .map(action => {
        return action.map(snap => {
          const data = snap.payload.doc.data() as Leave;
          const id = snap.payload.doc.id;
          return { id, data };
        })
      });
  }

  getLeavesByStatusForUser(userId: string, status: number) {
    this.leaveCollection = this.afs.collection('leaves', ref => {
      return ref.where('userId', '==', userId)
        .where('status', '==', status)
        .orderBy('from', 'desc');
    });
    return this.leaveCollection.valueChanges();
  }

  getBadgeCount(isManager: string) {
    if (isManager == "true")
      return this.getLeavesByUser(this.ukey, true);
    else
      return this.getLeavesByUser(this.ukey, false);
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
          .where('managerId', '==', userId)
          .orderBy('from', 'asc');
      });
    }
    else {
      this.filteredLeaveCollection = this.afs.collection('leaves', ref => {
        return ref.where('from', '>=', startDate)
          .where('teamId', '==', teamId)
          .orderBy('from', 'asc');
      });
    }
    return this.filteredLeaveCollection.valueChanges();
  }

  getLeavelstByDateRange(isManager: string, teamId: string, startDate: Date, endDate: Date, userId: string) {

    if (isManager == 'true' && startDate != null && endDate != null) {
      this.filteredLeaveCollection = this.afs.collection('leaves', ref => {
        return ref.where('from', '<=', startDate)
        .where('managerId', '==', userId)
        .where('status','==',1);
         
      });
    }
    else {
      this.filteredLeaveCollection = this.afs.collection('leaves', ref => {
        return ref.where('from', '<=', startDate)
        .where('teamId', '==', teamId)
        .where('status','==',1);

      });
    }
    return this.filteredLeaveCollection.valueChanges();
  }
  
}
