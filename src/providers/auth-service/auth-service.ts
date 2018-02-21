import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import { ToastController } from 'ionic-angular';
import { UserServiceProvider } from '../user-service/user-service';
import { User } from '../../models/user.model';
import { AngularFirestore } from 'angularfire2/firestore';
import { AppContextProvider } from '../app-context/app-context';

@Injectable()
export class AuthServiceProvider {

  public user: Observable<firebase.User>;

  constructor(public afAuth: AngularFireAuth,
    public toastCtrl: ToastController,
    public db: AngularFirestore,
    public appContext: AppContextProvider,
    public userService: UserServiceProvider) {
    this.user = this.afAuth.authState;
  }

  signIn(credentials) {
    return this.afAuth.auth.signInWithEmailAndPassword(credentials.userid, credentials.password);
  }

  forgotPassword(credentials) {
    return firebase.auth().sendPasswordResetEmail(credentials.userid)
  }

  signOut() {
    return firebase.auth().signOut();
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
                //uid: firebase.auth().currentUser.uid,
                name: firebase.auth().currentUser.displayName,
                email: firebase.auth().currentUser.email,
                photoUrl: firebase.auth().currentUser.photoURL,
                phoneNumber: firebase.auth().currentUser.phoneNumber,
                manager: null,
                team: null,
                isManager: false
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
