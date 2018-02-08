import { Pipe, PipeTransform } from '@angular/core';
import { AppContextProvider } from '../../providers/app-context/app-context';

@Pipe({
  name: 'filterByIsManagerFlag',
})
export class FilterByIsManagerFlagPipe implements PipeTransform {

  constructor(private appContext: AppContextProvider) { }

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
            localStorage.setItem('isManager','true');
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
