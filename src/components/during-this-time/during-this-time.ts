import { Component } from '@angular/core';

/**
 * Generated class for the DuringThisTimeComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'during-this-time',
  templateUrl: 'during-this-time.html'
})
export class DuringThisTimeComponent {

  text: string;

  constructor() {
    console.log('Hello DuringThisTimeComponent Component');
    this.text = 'Hello World';
  }

}
