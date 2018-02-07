import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByEmailId',
})
export class FilterByEmailIdPipe implements PipeTransform {
  transform(array: [any], emailId: string) {
    if (array) {
      var results = array.filter(a => a.email == emailId);
      if(results && results.length == 1 && results[0]) {
        return results[0].name;
      }

      return "N/A";
    }
  }
}
