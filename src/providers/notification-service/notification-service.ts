import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection,AngularFirestoreDocument } from 'angularfire2/firestore';
import { Leave } from '../../models/leave.model';

@Injectable()
export class NotificationService {
  leaveCollection: AngularFirestoreCollection<Leave> = null;
  leaveDocument: AngularFirestoreDocument<Leave>;
  snapshot:any;
  constructor(
    public afs: AngularFirestore) {
  }

  acceptleave(leaveId:string,isManager:boolean,managerId?:string):void{
    this.leaveDocument = this.afs.doc('leaves/'+ leaveId);
    if(isManager)
      this.leaveDocument.update({status: 1, managerId: managerId, modifiedAt: new Date() });
    else
      this.leaveDocument.update({isRead: true});
  }
  
  declineLeave(leaveId:string,isManager:boolean,managerId?:string):void{
    this.leaveDocument = this.afs.doc('leaves/'+ leaveId);
    if(isManager)
      this.leaveDocument.update({status: 2, managerId: managerId, modifiedAt: new Date() });
    else
      this.leaveDocument.update({isRead: true});
  }

  archieveLeave(leaveId:string){
    this.leaveDocument = this.afs.doc('leaves/'+ leaveId);
    this.leaveDocument.update({isRead: true});
  }
}
