import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { 
  AngularFireDatabase, 
  AngularFireList
} from 'angularfire2/database';
import { Leave } from '../../models/leave.model';
import * as firebase from 'firebase';

@Injectable()
export class NotificationService {
  uid:string = firebase.auth().currentUser.uid;
  constructor(public db: AngularFireDatabase) {
  }

  getAllPendingLeaves():AngularFireList<Leave> {
    return this.db.list<Leave>('/leaves/'+ this.uid);    
  }

  acceptleave(leaveId):void{
    this.db.object('/leaves/'+ this.uid + '/' + leaveId).update({status: 1,approver: this.uid, modifiedAt: new Date()});//~(1)accept
  }
  
  declineLeave(leaveId):void{
    this.db.object('/leaves/'+ this.uid + '/' + leaveId).update({status: 2,approver: this.uid, modifiedAt: new Date()});//~(2)decline
  }

  duringThisTime(startDate,endDate){
    
  }
}
