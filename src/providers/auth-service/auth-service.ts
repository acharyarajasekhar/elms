import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { ToastController } from 'ionic-angular';

@Injectable()
export class AuthServiceProvider {

  user: Observable<firebase.User>;

  constructor(public afAuth: AngularFireAuth, 
    public toastCtrl: ToastController) {
    this.user = this.afAuth.authState;
  }

  signIn(credentials) {    
    return this.afAuth.auth.signInWithEmailAndPassword(credentials.userid, credentials.password)
      .catch(err => { this.presentToast(err); });
  }

  signOut() {
    this.afAuth.auth.signOut();
  }

  signUp(credentials) {
    return this.afAuth.auth.createUserWithEmailAndPassword(credentials.userid, credentials.password)
      .catch(err => { this.presentToast(err); });
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

}
