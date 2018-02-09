import { Injectable } from '@angular/core';
import { AuthServiceProvider } from '../auth-service/auth-service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subject } from 'rxjs/Subject';
import { retry } from 'rxjs/operators/retry';
import { AppContextProvider } from '../app-context/app-context';

@Injectable()
export class UserServiceV2Provider {

  constructor(private auth: AuthServiceProvider,
    private store: AngularFirestore,
    private appContext: AppContextProvider) {
    this.auth.user.subscribe(account => {
      this.appContext.myAccount.next(account);
      this.getUserProfileByEmailID(account.email).subscribe((profile: any) => {
        if(profile !=null){
        this.getUserProfileByEmailID(profile.manager.id).subscribe((manager: any) => {
          profile.manager = manager;
          var teamId = profile.team.id;
          this.getTeamByTeamID(teamId).subscribe(team => {
            profile.team = team;
            this.appContext.myProfile.next(profile);
            this.getUsersByTeamID(teamId).subscribe(teamMembers => {
              teamMembers.forEach((teamMember: any, i, arr) => {
                teamMember.manager = profile.manager;
                teamMember.team = profile.team;
                if (i == arr.length - 1) {
                  this.appContext.myTeamMembers.next(teamMembers);
                }
              })              
            })
          })
        })
        }
        if (profile !=null && profile.isManager) {
          this.getReporteesByManagerEmailID(profile.email).subscribe(reportees => {
            if (reportees || reportees.length == 0) { this.appContext.myReportees.next([]) }
            reportees.forEach((reportee: any, i, arr) => {
              reportee.manager = profile;
              reportee.team.get().then(team => {
                reportee.team = team.data();
                if (i == arr.length - 1) {
                  this.appContext.myReportees.next(reportees);
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
