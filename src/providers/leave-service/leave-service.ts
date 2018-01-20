import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection,AngularFirestoreDocument } from 'angularfire2/firestore';
import { Leave } from '../../models/leave.model';
import { LeaveStatus } from '../../models/leavestatus.enum';
import { UserServiceProvider } from '../user-service/user-service';
import { AuthServiceProvider } from '../auth-service/auth-service';
import { TeamServiceProvider } from '../team-service/team-service';
import { Observable } from 'rxjs/Observable';
import { mergeMap } from 'rxjs/operators';
import { forkJoin } from "rxjs/observable/forkJoin";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import * as firebase from 'firebase';
import * as moment from 'moment';
import { PipesModule } from '../../pipes/pipes.module';


@Injectable()
export class LeaveServiceProvider { 
  ukey:string = localStorage.getItem('myId');
  leaveCollection: AngularFirestoreCollection<Leave> = null;
  leaveDocument: AngularFirestoreDocument<Leave>;
  snapshot:any;
  team$:any;
  constructor(
    public afs: AngularFirestore,
    public auth: AuthServiceProvider,
    private teamService:TeamServiceProvider,
    private userService:UserServiceProvider) {
  }

  createLeave(leave:Leave){
    leave.requestor = this.ukey;
    leave.status = LeaveStatus.Requested;
    leave.createdAt = new Date().toISOString();
    leave.isRead = false;
    leave.userId = this.ukey;
    leave.name = localStorage.getItem('myName');
    leave.photoUrl = localStorage.getItem('myphotoUrl');
    this.userService.getMyManager(this.ukey).subscribe(obj=>{
      leave.manager = obj.manager;
      this.afs.collection('leaves').add(leave);
    });

  }
  
  getLeavesByUser(ukey:string,isManager:boolean) {
     if(isManager){
      this.leaveCollection = this.afs.collection('leaves',ref=>{
        return ref.where('manager','==', ukey)
                  .where('status','==',0)
                  .orderBy('createdAt','desc');
      });
    }
    else{
      this.leaveCollection = this.afs.collection('leaves',ref=>{
        return ref.where('isRead','==',false)
                  .where('userId','==', ukey)
                  //.where('status','==',0)
                  .orderBy('createdAt','desc');
      });
    }
    //return leavecollection as Observable
    return this.leaveCollection.snapshotChanges()
    .map( action =>{
         return action.map(snap=>{
           const data = snap.payload.doc.data() as Leave;
           const id = snap.payload.doc.id;
           return {id, data};
         })
    });  
  }

  getLeavesByStatusForUser(userId:string,status:number) {
    this.leaveCollection = this.afs.collection('leaves', ref=>{
       return ref.where('userId','==',userId )
                 .where('status','==',status )
                 .orderBy('from','desc');
    });
    return this.leaveCollection.valueChanges();    
  }

  getBadgeCount(isManager:string){
    if(isManager == "true")
      return this.getLeavesByUser(this.ukey, true);
    else
      return this.getLeavesByUser(this.ukey, false);
  }

  getLeaveByDuration(userId:string,startDate?:string,endDate?:string){
    if(!startDate){
      this.leaveCollection = this.afs.collection('leaves/'+ userId, ref=>{
        return ref.where('from','>=',startDate ).orderBy('from','desc');
      });
      return this.leaveCollection.valueChanges();
    }
    if(!endDate){
      this.leaveCollection = this.afs.collection('leaves/'+ userId, ref=>{
        return ref.where('to','<=',endDate ).orderBy('from','desc');
      });
      return this.leaveCollection.valueChanges();
    } 
    if(!endDate && !startDate){
      this.leaveCollection = this.afs.collection('leaves/'+ userId, ref=>{
        return ref.where('from','>=',startDate ).where('to','<=',endDate).orderBy('from','desc');
      });
      return this.leaveCollection.valueChanges();
    } 
  }

}
