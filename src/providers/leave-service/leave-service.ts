import { Injectable} from '@angular/core';
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
    let localeFrmDt = formatDateUsingMoment(frDt,"L");//---------> ~> MM/DD/YYYY
    let toDt = leave.to;
    let localeToDt = formatDateUsingMoment(toDt,"L");//----------> ~> MM/DD/YYYY
    leave.requestor = this.ukey;
    leave.status = LeaveStatus.Requested;
    leave.createdAt = new Date();//------------------------------> locale date format 
    leave.from = new Date(leave.from);//-------------------------> string ~> locale date format 
    leave.to = new Date(leave.to);//-----------------------------> string ~> locale date format
    leave.unixFrDate = formatDateUsingMoment(localeFrmDt,"U");//-> string ~> unix date format
    leave.unixToDate = formatDateUsingMoment(localeToDt,"U");//--> string ~> unix date format
    leave.isRead = false;
    leave.userId = this.ukey;
    leave.name = localStorage.getItem('myName');
    leave.photoUrl = localStorage.getItem('myphotoUrl');
    this.userService.getMyManager(this.ukey).subscribe(obj => {
      leave.manager = obj.manager;
      this.afs.collection('leaves').add(leave);
    });
  }

  getLeavesByUser(ukey: string, isManager: boolean) {
    if (isManager) {
      this.leaveCollection = this.afs.collection('leaves', ref => {
        return ref.where('manager', '==', ukey)
          .where('status', '==', 0)
          .orderBy('unixFrDate', 'desc');
      });
    }
    else {
      this.leaveCollection = this.afs.collection('leaves', ref => {
        return ref.where('isRead', '==', false)
          .where('userId', '==', ukey)
          .orderBy('unixFrDate', 'desc');
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

  getLeaveByDuration(startDate?, endDate?, userId?: string) {
    if (startDate !="" && endDate == "") {
      let unixFrmDt = formatDateUsingMoment(startDate, 'U');
      this.filteredLeaveCollection = this.afs.collection('leaves', ref => {
        return ref.where('unixFrDate', '>=', unixFrmDt)
                  .orderBy('unixFrDate', 'desc');
      });
    }
    else{
      this.filteredLeaveCollection = this.afs.collection('leaves', ref => {
        return ref.orderBy('unixFrDate', 'desc');
      });    
    }
    return this.filteredLeaveCollection.valueChanges();
    // return this.filteredLeaveCollection.snapshotChanges()
    // .map(action => {
    //   return action.map(snap => {
    //     const data = snap.payload.doc.data() as Leave;
    //     const id = snap.payload.doc.id;
    //     return { id, data };
    //   })
    // });
  }

}
