import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AppContextProvider {

  myAccount = new Subject<any>();
  myProfile = new Subject<any>();
  myTeamMembers = new Subject<any>();
  myReportees = new Subject<any>();
  todaysLeaves = new Subject<any>();
  tomorrowsLeaves = new Subject<any>();
  searchedLeaves = new Subject<any>();

  constructor() {
    console.log("Hello App Context");
    this.myAccount.next([]);
    this.myProfile.next([]);
    this.myTeamMembers.next([]);
    this.myReportees.next([]);
    this.todaysLeaves.next([]);
    this.tomorrowsLeaves.next([]);
    this.searchedLeaves.next([]);
  }

}
