import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { 
  AngularFireDatabase, 
  AngularFireList
} from 'angularfire2/database';
import { Leave } from '../../models/leave.model';

@Injectable()
export class NotificationService {
  constructor(public db: AngularFireDatabase) {
    this.getAllPendingLeaves();
  }

  getAllPendingLeaves():AngularFireList<{}> {
    return this.db.list('/leaves');
  }

  acceptleave(leaveId):void{
    this.db.object('/leaves/'+ leaveId).update({status:'Accepted'});
  }
  
  declineLeave(leaveId):void{
    this.db.object('/leaves/'+ leaveId).update({status:'Declined'});
  }

  duringThisTime(startDate,endDate){
    
  }
}
