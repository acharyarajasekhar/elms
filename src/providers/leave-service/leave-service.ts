import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'; 

export enum LeaveStatus {
  Requested = 0,
  Accepted = 1,
  Declined = 2,
  Cancelled = 3
}

export interface Leave {
  requestor: string,
  from: Date,
  to: Date,
  isHalfDay: boolean,
  reason: string,
  approvor: string,
  status: LeaveStatus,
  createdAt: Date,
  modifiedAt: Date
}

@Injectable()
export class LeaveServiceProvider {

  leaves: AngularFireList<Leave> = null;

  constructor(public db: AngularFireDatabase) {
    this.leaves = this.db.list('leaves');
  }

  createLeave(leave: Leave) {
    this.leaves.push(leave);
  }

}
