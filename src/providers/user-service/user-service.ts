import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection,AngularFirestoreDocument } from 'angularfire2/firestore';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class UserServiceProvider {
  userCollection: AngularFirestoreCollection<User> = null;
  mgrCollection: AngularFirestoreCollection<User> = null;
  userDocument: AngularFirestoreDocument<User>;
  snapshot:any;
  constructor(public afs: AngularFirestore) {
  }

  getUsers():Observable<User[]>{
    this.userCollection = this.afs.collection('users', ref=>{
      return ref.orderBy('name','asc');
    });
    return this.userCollection.valueChanges();
  }

  getManagers():Observable<{}[]>{
    this.mgrCollection = this.afs.collection('users', ref=>{
      return ref.where('isManagerRole','==',true)
                .orderBy('name','asc');
    });
    return this.mgrCollection.snapshotChanges()
                .map( action =>{
                    return action.map(snap=>{
                      const data = snap.payload.doc.data() as User;
                      const id = snap.payload.doc.id;
                      return {id, data };
                })
    });
  }

  getUserByKey(key:string):Observable<User>{
    this.userDocument = this.afs.doc('users/' + key);
    return this.userDocument.valueChanges();
  }

  createUser(user: User) {
    this.afs.collection('users').add(user);
  }

  updateUserById(userId,data){
    this.userDocument = this.afs.doc('users/' + userId);
    this.userDocument.update(data);
  }

  getLoggedInUsersMetaInfo(userId:string):any{
    this.userCollection = this.afs.collection('users',ref=>{
      return ref.where("uid","==", userId)
    });
    return this.userCollection.snapshotChanges()
                       .map( action =>{
                            return action.map(snap=>{
                              const data = snap.payload.doc.data() as User;
                              const id = snap.payload.doc.id;
                              return {id, data };
                            })
                       });
  }

  getMyTeam(teamId:number):Observable<User[]>{
    this.userCollection = this.afs.collection('users', ref=>{
      return ref.orderBy('name','asc').where('team','==',teamId);
    });
    return this.userCollection.valueChanges();
  }

  getMyManager(mgrId:string):Observable<any>{
    this.userDocument = this.afs.doc('users/' + mgrId);
    return this.userDocument.valueChanges();
  }

}
