import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection,AngularFirestoreDocument } from 'angularfire2/firestore';
import { Team } from '../../models/team.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class TeamServiceProvider {
  teamCollection: AngularFirestoreCollection<Team> = null;
  teamDocument: AngularFirestoreDocument<Team>;
  snapshot:any;
  constructor(public afs: AngularFirestore) {
  }

  getTeamsByManager(managerId:string){
    this.teamCollection =  this.afs.collection('teams',ref=>{
      return ref.where("manager","==", managerId);
    });
    return this.teamCollection.snapshotChanges()
    .map( action =>{
         return action.map(snap=>{
           const data = snap.payload.doc.data() as Team;
           const id = snap.payload.doc.id;
           return {id, data };
         })
    });
  }

  getTeamByKey(key:string):Observable<any>{
    this.teamDocument = this.afs.doc('teams/'+ key);
    return this.teamDocument.valueChanges();
  }
  
}
