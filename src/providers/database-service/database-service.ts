import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Injectable()
export class DatabaseServiceProvider {

  constructor(public afd: AngularFireDatabase) {
    console.log('Hello DatabaseServiceProvider Provider');
  }

}
