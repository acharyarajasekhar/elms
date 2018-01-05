import { Component } from '@angular/core';

/**
 * Generated class for the WhoIsOnLeaveComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'who-is-on-leave',
  templateUrl: 'who-is-on-leave.html'
})
export class WhoIsOnLeaveComponent {

  text: string;

  constructor() {
    console.log('Hello WhoIsOnLeaveComponent Component');
    this.text = 'Hello World';
  }

}
