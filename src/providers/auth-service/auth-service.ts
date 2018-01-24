import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import { ToastController } from 'ionic-angular';
import { UserServiceProvider } from '../user-service/user-service';
import { User } from '../../models/user.model';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class AuthServiceProvider {

  public user: Observable<firebase.User>;

  constructor(public afAuth: AngularFireAuth,
    public toastCtrl: ToastController,
    public db: AngularFirestore,
    public userService: UserServiceProvider) {
    this.user = this.afAuth.authState;

    var usersCollectionRef = this.db.collection('Users').valueChanges();
    
    usersCollectionRef.subscribe(dd => {
      console.log(dd);
    })

    var fromDTTM = new Date("01/10/2018");
    var toDTTM = new Date("01/30/2018");

    var leavesCollectionRef = this.db.collection('Leaves', 
      ref => ref
        .where("ToDTTM", ">=", fromDTTM)
        .orderBy("ToDTTM", "asc")
    ).valueChanges();

    leavesCollectionRef.subscribe(leaves => {
      var myLeaves:Array<any> = [];
       
      leaves.forEach((leaveItem:any) => { 
        if(leaveItem.FromDTTM <= toDTTM)       
        leaveItem.Owner.get()
          .then(userRef => { 
              var user = userRef.data(); 
              user.Manager.get()
                .then(managerRef => {
                  user.Manager = managerRef.data();
                });
              user.Team.get()
                .then(teamRef => {
                  user.Team = teamRef.data();
                });
              leaveItem.Owner = user;
              myLeaves.push(leaveItem); 
          });
      });

      console.log(myLeaves);
    })

  }

  signIn(credentials) {
    return this.afAuth.auth.signInWithEmailAndPassword(credentials.userid, credentials.password)
      .catch(err => { this.presentToast(err); })
      .then((data) => {  
        if (firebase.auth().currentUser != null && !firebase.auth().currentUser.emailVerified) {
            this.signOut();
              return firebase.auth().currentUser.sendEmailVerification().then(() => {
            this.presentToast("Please verify your email before login... Verfication email sent... Please check your inbox...");
              return this.afAuth.auth.currentUser;//firebase.auth().currentUser;
          })
            .catch(err => { this.presentToast(err); return err; });
        }
      });
  }

  signOut() {
    firebase.auth().signOut().then(()=>{
      localStorage.removeItem('authId');
      localStorage.removeItem('myId');
      localStorage.removeItem('myName');
      localStorage.removeItem('myphotoUrl');
      localStorage.removeItem('myTeam');
      localStorage.removeItem('myEmail');
      localStorage.removeItem('myMobile');
      localStorage.removeItem('myManager');
      localStorage.removeItem('isManagerRole');
      localStorage.clear();
    });
  }

  signUp(credentials) {
    return this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password)
      .catch(err => { this.presentToast(err); return err; })
      .then(data => {
        return firebase.auth().currentUser.updateProfile({
          "displayName": credentials.name,
          "photoURL": "https://u.o0bc.com/avatars/stock/_no-user-image.gif"
        })
          .then(() => {
            return firebase.auth().currentUser.sendEmailVerification().then(() => {

              let user: User = {
                uid: firebase.auth().currentUser.uid,
                name: firebase.auth().currentUser.displayName,
                email: firebase.auth().currentUser.email,
                photoUrl: firebase.auth().currentUser.photoURL,
                phoneNumber: firebase.auth().currentUser.phoneNumber,
                manager: "",
                team: "",
                isManagerRole: false
              };

              this.userService.createUser(user);

              this.presentToast("Verfication email sent... Please check your inbox...");
              return firebase.auth().currentUser;
            })
              .catch(err => { this.presentToast(err); return err; });
          })
          .catch(err => { this.presentToast(err); return err; });
      });
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

}
