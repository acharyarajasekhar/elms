import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection,AngularFirestoreDocument } from 'angularfire2/firestore';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Team } from '../../models/team.model';

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

  /***CREATE User Object***/
  createUser(user: User) {
    this.afs.collection('eUsers/').doc(user.email).set({
      "name":user.name,
      "email":user.email,
      "phoneNumber":user.phoneNumber,
      "isManager":user.isManager,
      "photoUrl":user.photoUrl,
      "team":user.team,
      "manager":user.manager
    });
  }

  /***GET User Context details***/
  getUserById(userId:string){
    console.log(userId);
    this.userDocument = this.afs.doc('eUsers/' + userId);
    return this.userDocument.snapshotChanges()
    .map(snap=>{
       let userContext:any = snap.payload.data() as User;
       snap.payload.data().manager.get().then(mgrRef=>{
        localStorage.setItem('mgrName',(mgrRef.data() as User).name);
        localStorage.setItem('mgrEmail',(mgrRef.data() as User).email);
       });
       snap.payload.data().team.get().then(tmRef=>{
        localStorage.setItem('teamName',(tmRef.data() as Team).name);
        localStorage.setItem('teamId',(tmRef.data() as Team).id);
       })
       return userContext;
    });
  }

  /***UPDATE User Object By Id***/
  updateUserById(userId,data){
    this.userDocument = this.afs.doc('eUsers/' + userId);
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
