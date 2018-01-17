import { Injectable, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'; 
import { Leave } from '../../models/leave.model';
import * as firebase from 'firebase';
import { LeaveStatus } from '../../models/leavestatus.enum';
import { UserServiceProvider } from '../user-service/user-service';
import { convertDataToISO } from 'ionic-angular/util/datetime-util';

@Injectable()
export class LeaveServiceProvider implements OnInit{
  uid:string = firebase.auth().currentUser.uid;
  
  constructor(
    public db: AngularFireDatabase,
    private userService:UserServiceProvider) {
    this.getLeaveList(); 
  }

  createLeave(leave:Leave){
    leave.requestor = this.uid;
    leave.status = LeaveStatus.Requested;
    leave.createdAt = new Date().toISOString();
    leave.isRead = false;
    this.db.list('leaves/'+ this.uid).push(leave);
  }
  
  getLeavesByUser():AngularFireList<Leave> {
    return this.db.list<Leave>('/leaves/'+ this.uid);    
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

  ngOnInit(){
    if(this.uid === "" || this.uid === null){
      this.uid = firebase.auth().currentUser.uid;
    }
  }
}
