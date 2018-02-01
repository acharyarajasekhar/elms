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

  acceptleave(leaveId:string,isManager:boolean,mgrId?:string):void{
    this.leaveDocument = this.afs.doc('eLeaves/'+ leaveId);
    if(isManager)
      this.leaveDocument.update({status: 1, managerId: mgrId, modifiedAt: new Date() });
    else
      this.leaveDocument.update({isRead: true});
  }
  
  declineLeave(leaveId:string,isManager:boolean,mgrId?:string):void{
    this.leaveDocument = this.afs.doc('eLeaves/'+ leaveId);
    if(isManager)
      this.leaveDocument.update({status: 2, managerId: mgrId, modifiedAt: new Date() });
    else
      this.leaveDocument.update({isRead: true});
  }

  archieveLeave(leaveId:string){
    this.leaveDocument = this.afs.doc('eLeaves/'+ leaveId);
    this.leaveDocument.update({isRead: true});
  }
}
