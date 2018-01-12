import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase';
import * as _  from 'lodash';
import { User } from '../../models/user.model';

@Injectable()
export class UserServiceProvider {
  users: AngularFireList<User> = null;
  constructor(public db: AngularFireDatabase) {
    this.getUsers();
  }

  getUsers(){
    this.users = this.db.list('/users');
  }

  createUser(user: User) {
    this.users.push(user);
  }

  updateUser(data){
    
  }

  getUsersInfo():any{
    return this.db.list('/users')
          .snapshotChanges()
          .map(
            changes=>{
            return changes.map(c=>(
              {key:c.payload.key,...c.payload.val()}
            ))
          });
  }

}
