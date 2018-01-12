import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'; 
<<<<<<< HEAD

//import { Leave } from '../../models/leave.model';

=======
import { Leave } from '../../models/leave.model';
>>>>>>> 0900a76dba85af2b5fe0494dafe568a7d5c551a6
import * as firebase from 'firebase/app';
import { DateTime } from 'ionic-angular/components/datetime/datetime';
import { LeaveStatus } from '../../models/leavestatus.enum';

@Injectable()
export class LeaveServiceProvider{
  uid:string = firebase.auth().currentUser.uid;
  leaves: AngularFireList<Leave> = null;
  
<<<<<<< HEAD
  constructor(public db: AngularFireDatabase) {
    this.leaves = this.db.list('leaves/'+ this.uid);
  }

  createLeave(leave:Leave){
    leave.requestor = this.uid;
=======
  constructor(public db: AngularFireDatabase) {   
    this.leaves = this.db.list('leaves');
  }

  createLeave(leave:Leave){
    debugger;
    leave.requestor = firebase.auth().currentUser.uid;
>>>>>>> b616bb3139e762fe06601d1a4c7ba9ec34569604
    leave.status = LeaveStatus.Requested;
    leave.createdAt = new Date();
    console.log(leave);
    this.leaves.push(leave);
  }

<<<<<<< HEAD
  getLeaveList(){
    return this.leaves;
=======
  getAllLeaves():AngularFireList<{}> {
    return this.db.list('/leaves');
>>>>>>> b616bb3139e762fe06601d1a4c7ba9ec34569604
  }

}
