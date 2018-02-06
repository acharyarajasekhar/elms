import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection,AngularFirestoreDocument } from 'angularfire2/firestore';
import { Leave } from '../../models/leave.model';
import { EmailServiceProvider } from '../email-service/email-service';

@Injectable()
export class NotificationService {
  leaveCollection: AngularFirestoreCollection<Leave> = null;
  leaveDocument: AngularFirestoreDocument<Leave>;
  snapshot:any;
  constructor(
    public afs: AngularFirestore, private emailSvc: EmailServiceProvider) {
  }

  acceptleave(leaveId:string,isManager:boolean,mgrId?:string):void{
    this.leaveDocument = this.afs.doc('eLeaves/'+ leaveId);
    if(isManager){
      this.leaveDocument.update({status: 1, modifiedAt: new Date() })
      .then(result => {
        this.emailSvc.trigger(leaveId, 1);
      }).catch(err=>{console.log(err)});
      console.log('status-1');
    }
    else{
      this.leaveDocument.update({isRead: true});
      console.log('archieved');
    }
  }
  
  declineLeave(leaveId:string,isManager:boolean,mgrId?:string):void{
    this.leaveDocument = this.afs.doc('eLeaves/'+ leaveId);
    if(isManager){
      this.leaveDocument.update({status: 2, modifiedAt: new Date() })
      .then(result => {
        this.emailSvc.trigger(leaveId, 2);
      }).catch(err=>{console.log(err)});
      console.log('status-2');
    }
    else{
      this.leaveDocument.update({isRead: true});
      console.log('archieved');
    }
  }

  archieveLeave(leaveId:string){
    this.leaveDocument = this.afs.doc('eLeaves/'+ leaveId);
    this.leaveDocument.update({isRead: true});
    console.log('archieved');
  }
}
