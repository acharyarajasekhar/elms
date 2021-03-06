import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByIsManagerFlag',
})
export class FilterByIsManagerFlagPipe implements PipeTransform {

  transform(leaves: [{}], teamCollection: [{}], reporteesCollection: [{}], myProfile: any) {
    var results = [];
    if (leaves && leaves.length > 0) {
      if (myProfile) {
        leaves.forEach((leave: any, i, arr) => {

          var owner = teamCollection.filter((t: any) => (t.email == leave.owner.id || t.email == leave.owner.email))[0];
          if (owner) {
            leave.owner = owner;
          }

          if (myProfile.isManager) {
            var owner = reporteesCollection.filter((t: any) => (t.email == leave.owner.id || t.email == leave.owner.email))[0];
            if (owner) {
              leave.owner = owner;
            }
          }
        })
      }
    }
    return leaves.filter((leave: any) => leave.owner.email);;
  }
}
