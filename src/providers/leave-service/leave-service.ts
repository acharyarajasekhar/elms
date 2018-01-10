import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'; 
import { Leave } from '../../models/leave.model';

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
