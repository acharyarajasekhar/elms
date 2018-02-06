import { Injectable } from '@angular/core';
import { AuthServiceProvider } from '../auth-service/auth-service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable, Subject } from 'rxjs';
import { retry } from 'rxjs/operators/retry';

@Injectable()
export class UserServiceV2Provider {

  myAccount = new Subject<any>();
  myProfile = new Subject<any>();
  myTeamMembers = new Subject<any>();
  myReportees = new Subject<any>();

  constructor(private auth: AuthServiceProvider,
    private store: AngularFirestore) {
    this.auth.user.subscribe(account => {
      this.myAccount.next(account);
      this.getUserProfileByEmailID(account.email).subscribe((profile: any) => {
        this.getUserProfileByEmailID(profile.manager.id).subscribe((manager: any) => {
          profile.manager = manager;
          var teamId = profile.team.id;
          this.getTeamByTeamID(teamId).subscribe(team => {
            profile.team = team;
            this.myProfile.next(profile);
            this.getUsersByTeamID(teamId).subscribe(teamMembers => {
              this.myTeamMembers.next(teamMembers);
            })
          })
        })
        if (profile.isManager) {
          this.getReporteesByManagerEmailID(profile.email).subscribe(reportees => {
            if (reportees || reportees.length == 0) { this.myReportees.next([]) }
            reportees.forEach((reportee: any, i, arr) => {
              reportee.manager = profile;
              reportee.team.get().then(team => {
                reportee.team = team.data();
                if (i == arr.length - 1) {
                  this.myReportees.next(reportees);
                }
              })
            })
          })
        }
      })
    })
  }

  getUserProfileByEmailID(emailId) {
    return this.store.doc('eUsers/' + emailId).valueChanges();
  }

  getUsersByTeamID(teamId) {
    return this.store.collection('eUsers', ref => ref.where('team', "==", this.store.doc('eTeam/' + teamId).ref)).valueChanges();
  }

  getTeamByTeamID(teamId) {
    return this.store.doc("eTeam/" + teamId).valueChanges();
  }

  getReporteesByManagerEmailID(emailId) {
    return this.store.collection('eUsers', ref => ref.where('manager', "==", this.store.doc('eUsers/' + emailId).ref)).valueChanges();
  }

}
