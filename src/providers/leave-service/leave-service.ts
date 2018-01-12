import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'; 
import { Leave } from '../../models/leave.model';
import * as firebase from 'firebase';
import { DateTime } from 'ionic-angular/components/datetime/datetime';
import { LeaveStatus } from '../../models/leavestatus.enum';

@Injectable()
export class LeaveServiceProvider{
  uid:string = firebase.auth().currentUser.uid;
  leaves: AngularFireList<Leave> = null;
  
  constructor(public db: AngularFireDatabase) {
    this.getLeaveList(); 
  }

  createLeave(leave:Leave){
    leave.requestor = this.uid;
    leave.status = LeaveStatus.Requested;
    leave.createdAt = new Date();
    console.log(leave);
    this.leaves.push(leave);
  }

  getLeaveList(){
    return this.db.list('/leaves/'+ this.uid);
  }

  getAllLeaves():AngularFireList<{}> {
    return this.db.list('/leaves');
  }

}
