import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase';
import * as _  from 'lodash';
import { User } from '../../models/user.model';

@Injectable()
export class UserServiceProvider {
  user:User;
  users: AngularFireList<User> = null;
  constructor(public db: AngularFireDatabase) {
    this.users = this.db.list('users');
  }

  createUser(user: User) {
    this.users.push(user);
  }

  updateUser(data){
    
  }

  getUserByKey(key:string){
    this.db.object<User>('/users/'+ key).snapshotChanges().map(changes=>{
      return {key:changes.payload.key,...changes.payload.val()}
    }).subscribe(user=>{
      this.user = user;
    });

    return this.user;
  }

  getUserByUID(userID:string):User{
    this.db.list<User>('/users')
           .snapshotChanges()
            // .map(
            //   changes=>{
            //   return changes.map(c=>({
            //     key:c.payload.key,...c.payload.val()
            //   }))
            // })
            .subscribe(result=>{
             this.user =  _.filter(result, { uid : userID});
    });
    return this.user;
  }

}
