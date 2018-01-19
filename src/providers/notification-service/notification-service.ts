import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection,AngularFirestoreDocument } from 'angularfire2/firestore';
import { Leave } from '../../models/leave.model';
import { AuthServiceProvider } from '../auth-service/auth-service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as firebase from "firebase";

@Injectable()
export class NotificationService {
  leaveCollection: AngularFirestoreCollection<Leave> = null;
  leaveDocument: AngularFirestoreDocument<Leave>;
  snapshot:any;
  constructor(
    public afs: AngularFirestore,
    public auth: AuthServiceProvider,) {
  }

  acceptleave(leaveId:string,isManager:boolean,managerId?:string):void{
    this.leaveDocument = this.afs.doc('leaves/'+ leaveId);
    if(isManager)
      this.leaveDocument.update({status: 1, manager: managerId, modifiedAt: new Date() });//~(1)accept
    else
      this.leaveDocument.update({isRead: true});//~(1)accept
  }
  
  declineLeave(leaveId:string,isManager:boolean,managerId?:string):void{
    this.leaveDocument = this.afs.doc('leaves/'+ leaveId);
    if(isManager)
      this.leaveDocument.update({status: 2, manager: managerId, modifiedAt: new Date() });//~(1)accept
    else
      this.leaveDocument.update({isRead: true});//~(1)accept
  }

  archieveLeave(leaveId:string){
    this.leaveDocument = this.afs.doc('leaves/'+ leaveId);
    this.leaveDocument.update({isRead: true});
  }
}
