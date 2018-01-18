import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase,AngularFireList } from 'angularfire2/database';
import { Team } from '../../models/team.model';

@Injectable()
export class TeamServiceProvider {
  teams: AngularFireList<Team> = null;
  constructor(public db: AngularFireDatabase) {
    this.getTeams();
  }

  getTeams(){
    return this.db.list<Team>('/teams');
  }
}
