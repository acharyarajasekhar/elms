import { User } from './../user-service/user-service';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'; 
<<<<<<< HEAD

//import { Leave } from '../../models/leave.model';

=======
import { Leave } from '../../models/leave.model';
>>>>>>> 0900a76dba85af2b5fe0494dafe568a7d5c551a6
import * as firebase from 'firebase/app';
import { DateTime } from 'ionic-angular/components/datetime/datetime';

export enum LeaveStatus {
  Requested = 0,
  Accepted = 1,
  Declined = 2,
  Cancelled = 3
}

export interface Leave {
  from: Date,
  to: Date,
  isHalfDay: boolean,
  reason: string,

  requestor: string,  
  approvor: string,
  status: LeaveStatus,
  createdAt: Date,
  modifiedAt: Date
}

@Injectable()
export class LeaveServiceProvider{

  leaves: AngularFireList<Leave> = null;
  
  constructor(public db: AngularFireDatabase) {   
    this.leaves = this.db.list('leaves');
  }

  createLeave(leave:Leave){
    debugger;
    leave.requestor = firebase.auth().currentUser.uid;
    leave.status = LeaveStatus.Requested;
    leave.createdAt = new Date();
    console.log(leave);
    this.leaves.push(leave);
  }

  getAllLeaves():AngularFireList<{}> {
    return this.db.list('/leaves');
  }

}
