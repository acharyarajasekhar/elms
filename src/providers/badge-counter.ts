import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class BadgeCounterProvider {

  constructor() {
  }

  filterResults(leaves: any[], reporteesCollection: any[], myProfile: any){
    let badgeArray:any[]=[];
    if (leaves && leaves.length > 0) {
      if (myProfile) {
        leaves.forEach((leave: any, i, arr) => {

          if (leave.owner.id == myProfile.email) {
            leave.owner = myProfile;
            leave.isMyLeave = true;
          }

          if (myProfile.isManager) {
            var owner = reporteesCollection.filter((t: any) => (t.email == leave.owner.id || t.email == leave.owner.email))[0];
            if (owner) {
              leave.owner = owner;
            }
          }

          if (!(leave.isMyLeave && leave.isRead) && leave.owner.email) {
            badgeArray.push(leave);
          }
        })
      }
    }
    return badgeArray;
  }

}
