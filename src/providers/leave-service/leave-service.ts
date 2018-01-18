import { Injectable, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'; 
import { Leave } from '../../models/leave.model';
import { LeaveStatus } from '../../models/leavestatus.enum';
import { UserServiceProvider } from '../user-service/user-service';
import { AuthServiceProvider } from '../auth-service/auth-service';
import 'rxjs/add/operator/toPromise';
import * as firebase from "firebase";
import * as _ from 'lodash';
import { TeamServiceProvider } from '../team-service/team-service';

@Injectable()
export class LeaveServiceProvider { 
  uid: string = firebase.auth().currentUser.uid;
  constructor(
    public db: AngularFireDatabase,
    public auth: AuthServiceProvider,
    private teamService:TeamServiceProvider,
    private userService:UserServiceProvider) {
  }

  createLeave(leave:Leave){
    leave.requestor = this.uid;
    leave.status = LeaveStatus.Requested;
    leave.createdAt = new Date().toISOString();
    leave.isRead = false;
    this.db.list('leaves/'+ this.uid).push(leave);
  }
  
  getLeavesByUser(user:string) {
    return this.db.list<Leave>('/leaves/'+ user)
                  .snapshotChanges()
                  .map(
                    changes=>{
                    return changes.map(c=>(
                      {key:c.payload.key,...c.payload.val()}
                  ))
     });    
  }

  getLeaveList(){
    return this.db.list('/leaves/'+ this.uid);
  }

  getBadgeCount(userid?:string){
    if(userid)
      return this.getLeavesByUser(userid);
  }

  getAllLeaves(){
    return this.db.list('/leaves')
                  .snapshotChanges()
                  .map(
                  changes=>{
                  return changes.map(c=>({
                        key:c.payload.key,...c.payload.val()
          }))
    });
  }
}
