import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AppContextProvider {

  myAccountObject: any = {};
  myProfileObject: any = {};
  myTeamMembersCollection = [];
  myReporteesCollection = [];
  todaysLeavesCollection = [];
  tomorrowsLeavesCollection = [];
  searchedLeavesCollection = [];
  notificationLeavesCollection = [];

  myAccount = new Subject<any>();
  myProfile = new Subject<any>();
  myTeamMembers = new Subject<any>();
  myReportees = new Subject<any>();
  todaysLeaves = new Subject<any>();
  tomorrowsLeaves = new Subject<any>();
  searchedLeaves = new Subject<any>();
  notificationLeaves = new Subject<any>();

  searchDateRange: any = {};

  constructor() {
    console.log("Hello App Context");

    this.myProfile.subscribe(profile => {
      this.myProfileObject = profile;
    })

    this.myTeamMembers.subscribe(teamMates => {
      this.myTeamMembersCollection = teamMates;
    })

    this.myReportees.subscribe(reportees => {
      this.myReporteesCollection = reportees;
    })

    this.todaysLeaves.subscribe(leaves => {
      this.todaysLeavesCollection = leaves;
    })

    this.tomorrowsLeaves.subscribe(leaves => {
      this.tomorrowsLeavesCollection = leaves;
    })

    this.searchedLeaves.subscribe(leaves => {
      this.searchedLeavesCollection = leaves;
    })

    this.notificationLeaves.subscribe(leaves => {
      this.notificationLeavesCollection = leaves;
    })

    this.myAccount.next([]);
    this.myProfile.next([]);
    this.myTeamMembers.next([]);
    this.myReportees.next([]);
    this.todaysLeaves.next([]);
    this.tomorrowsLeaves.next([]);
    this.searchedLeaves.next([]);
    this.notificationLeaves.next([]);
  }

}
