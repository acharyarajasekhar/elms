import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Team } from '../../models/team.model';

@Injectable()
export class UserServiceProvider {
  userCollection: AngularFirestoreCollection<User> = null;
  mgrCollection: AngularFirestoreCollection<User> = null;
  userDocument: AngularFirestoreDocument<User>;
  snapshot: any;
  constructor(public afs: AngularFirestore) {
  }

  getUsers(): Observable<User[]> {
    this.userCollection = this.afs.collection('eUsers', ref => {
      return ref.orderBy('name', 'asc');
    });
    return this.userCollection.valueChanges();
  }

  /***GET all manager Object for DDL bind***/
  getManagers(): Observable<{}[]> {
    this.mgrCollection = this.afs.collection('eUsers', ref => {
      return ref.where('isManager', '==', true)
        .orderBy('name', 'asc');
    });
    return this.mgrCollection.snapshotChanges()
      .map(action => {
        return action.map(snap => {
          const data = snap.payload.doc.data() as User;
          const id = snap.payload.doc.id;
          return { id, data };
        })
      });
  }

  /***CREATE User Object***/
  createUser(user: User) {
    this.afs.collection('eUsers/').doc(user.email).set({
      "name": user.name,
      "email": user.email,
      "phoneNumber": user.phoneNumber,
      "isManager": user.isManager,
      "photoUrl": user.photoUrl,
      "team": null,
      "manager": null
    });
  }

  /***GET User Context details***/
  getUserById(userId: string) {
    this.userDocument = this.afs.doc('eUsers/' + userId);
    return this.userDocument.snapshotChanges()
      .map(snap => {
        let userContext: any = snap.payload.data() as User;
        console.log(snap.payload.data().manager);
        if (snap.payload.data().manager != "" && snap.payload.data().manager != null) {
          snap.payload.data().manager.get().then(mgrRef => {
            localStorage.setItem('mgrName', (mgrRef.data() as User).name);
            localStorage.setItem('mgrEmail', (mgrRef.data() as User).email);
          });
        }
        if (snap.payload.data().team != "" && snap.payload.data().team != null) {
          snap.payload.data().team.get().then(tmRef => {
            localStorage.setItem('teamName', (tmRef.data() as Team).name);
            localStorage.setItem('teamId', (tmRef.data() as Team).id);
          })
        }
        return userContext;
      });
  }

  /***UPDATE User Object By Id***/
  updateUserById(userId, userObj) {
    localStorage.setItem('teamName', userObj.team);
    localStorage.setItem('mgrName', userObj.manager);
    let mgrRef = this.afs.collection("eUsers").doc(userObj.manager).ref;
    let teamRef = this.afs.collection("eTeam").doc(userObj.team).ref
    this.userDocument = this.afs.doc('eUsers/' + userId);
    userObj.manager = mgrRef;
    userObj.team = teamRef;
    this.userDocument.update(userObj);
  }

  getLoggedInUsersMetaInfo(userId: string): any {
    this.userCollection = this.afs.collection('users', ref => {
      return ref.where("uid", "==", userId)
    });
    return this.userCollection.snapshotChanges()
      .map(action => {
        return action.map(snap => {
          const data = snap.payload.doc.data() as User;
          const id = snap.payload.doc.id;
          return { id, data };
        })
      });
  }

  getUserByKey(key:string):Observable<User>{
    this.userDocument = this.afs.doc('users/' + key);
    return this.userDocument.valueChanges();
  }

}
