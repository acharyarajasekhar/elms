import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'; 
import { Leave } from '../../models/leave.model';
import * as firebase from 'firebase';
import { LeaveStatus } from '../../models/leavestatus.enum';
import { UserServiceProvider } from '../user-service/user-service';
import { convertDataToISO } from 'ionic-angular/util/datetime-util';
import { AuthServiceProvider } from '../auth-service/auth-service';

@Injectable()
export class LeaveServiceProvider {

  myUserID: string = this.auth.user.uid;
  
  constructor(
    public auth: AuthServiceProvider,
    public db: AngularFireDatabase,
    private userService:UserServiceProvider) {
    this.getLeaveList(); 
  }

  createLeave(leave:Leave){
    leave.requestor = this.myUserID;
    leave.status = LeaveStatus.Requested;
    leave.createdAt = new Date().toISOString();
    leave.isRead = false;
    this.db.list('leaves/'+ this.myUserID).push(leave);
  }
  
  getLeavesByUser():AngularFireList<Leave> {
    return this.db.list<Leave>('/leaves/'+ this.myUserID);    
  }

  getLeaveList(){
    return this.db.list('/leaves/'+ this.myUserID);
  }

  getLeaveListByUID(usrid:string){
    return this.db.list('/leaves/'+ usrid);
  }

  getAllLeaves():AngularFireList<Leave[]> {
    return this.db.list('/leaves');
  }
}
