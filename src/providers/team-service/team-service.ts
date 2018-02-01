import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection,AngularFirestoreDocument } from 'angularfire2/firestore';
import { Team } from '../../models/team.model';

@Injectable()
export class TeamServiceProvider {
  teamCollection: AngularFirestoreCollection<Team> = null;
  teamDocument: AngularFirestoreDocument<Team>;
  snapshot:any;
  constructor(public afs: AngularFirestore) {
  }

  getTeams(){
    this.teamCollection =  this.afs.collection('eTeam');
    return this.teamCollection.valueChanges();
  }
  
}
