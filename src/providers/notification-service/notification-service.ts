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

  acceptleave(leaveId,isManager):void{
    if(isManager)
      this.db.object('/leaves/'+ this.uid + '/' + leaveId).update({status: 1,approver: this.uid, modifiedAt: new Date(),isRead: true});//~(1)accept
    else
      this.db.object('/leaves/'+ this.uid + '/' + leaveId).update({isRead: true});//~(1)accept
  }
  
  declineLeave(leaveId,isManager):void{
    if(isManager)
      this.db.object('/leaves/'+ this.uid + '/' + leaveId).update({status: 2,approver: this.uid, modifiedAt: new Date(),isRead: true});//~(2)decline
    else
      this.db.object('/leaves/'+ this.uid + '/' + leaveId).update({isRead: true});//~(2)decline
  }

  archieveLeave(leaveId){
    this.db.object('/leaves/'+ this.uid + '/' + leaveId).update({isRead: true});
  }

  duringThisTime(startDate,endDate){
    
  }
}
