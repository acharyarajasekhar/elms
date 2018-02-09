import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterNotification',
})
export class FilterNotificationPipe implements PipeTransform {
  transform(leaves: [{}], reporteesCollection: [{}], myProfile: any) {
    var results = [];
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
            results.push(leave);
          }
        })
      }
    }
    return results;
  }
}
