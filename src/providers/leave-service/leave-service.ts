import { User } from './../user-service/user-service';
import { Leave } from './leave-service';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'; 
<<<<<<< HEAD
import { Leave } from '../../models/leave.model';
=======
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
>>>>>>> de6b77cb43b96577fba870e9637edd07e46d6990

@Injectable()
export class LeaveServiceProvider{

  leaves: AngularFireList<Leave> = null;
  
  constructor(public db: AngularFireDatabase) {
    this.leaves = this.db.list('leaves');
  }

  createLeave(leave:Leave){
    leave.requestor = firebase.auth().currentUser.uid;
    leave.status = LeaveStatus.Requested;
    leave.createdAt = new Date();
    console.log(leave);
    this.leaves.push(leave);
  }

  getLeaveList(){

  }

}
