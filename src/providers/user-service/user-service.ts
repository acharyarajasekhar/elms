import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

export interface User {
  uid: string,
  name: string,
  email: string,
  photoUrl: string,
  phoneNumber: string,
  manager: string,
  team: string
}

@Injectable()
export class UserServiceProvider {

  users: AngularFireList<User> = null;

  constructor(public db: AngularFireDatabase) {
    this.users = this.db.list('users');
  }

  createUser(user: User) {
    this.users.push(user);
  }

  updateUser(data){
    
  }

}
