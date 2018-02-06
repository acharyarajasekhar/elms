import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class AppContextProvider {

  myAccount = new Subject<any>();
  myProfile = new Subject<any>();
  myTeamMembers = new Subject<any>();
  myReportees = new Subject<any>();
  todaysLeaves = new Subject<any>();
  tomorrowsLeaves = new Subject<any>();
  searchedLeaves = new Subject<any>();

  constructor() { }

}
