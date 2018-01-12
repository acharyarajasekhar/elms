import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'; 
import { Leave } from '../../models/leave.model';
import * as firebase from 'firebase';
import { LeaveStatus } from '../../models/leavestatus.enum';
import { UserServiceProvider } from '../user-service/user-service';

@Injectable()
export class LeaveServiceProvider{
  uid:string = firebase.auth().currentUser.uid;
  
  constructor(
    public db: AngularFireDatabase,
    private userService:UserServiceProvider) {
    this.getLeaveList(); 
  }

  createLeave(leave:Leave){
   console.log(this.uid);
    leave.requestor = this.uid;
    leave.status = LeaveStatus.Requested;
    leave.createdAt = new Date();
    leave.isRead = false;
    this.db.list('leaves/'+ this.uid).push(leave);
  }

  getLeaveList(){
    return this.db.list('/leaves/'+ this.uid);
  }

  getLeaveListByUID(usrid:string){
    return this.db.list('/leaves/'+ usrid);
  }

  getAllLeaves():AngularFireList<Leave[]> {
    return this.db.list('/leaves');
  }

}
