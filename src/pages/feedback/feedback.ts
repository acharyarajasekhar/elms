import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { commonMethods } from '../../helper/common-methods';

/**
 * Generated class for the FeedbackPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {

  title:string;
  description:string;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public _firestore:AngularFirestore,public _CmnMthd:commonMethods) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedbackPage');
  }

  submitFeedback()
  {
    var objFeedback={};
    let userId =JSON.parse(localStorage.getItem('userContext')).email;
    let consUserRef=this._firestore.collection("eUsers").doc(userId).ref;


    objFeedback['title']=this.title;
    objFeedback['description']=this.description;
    objFeedback['postedBy']=consUserRef;
    objFeedback['createdOn']=new Date();
    

    this._firestore.collection('eFeedbacks').add(objFeedback);
    this._CmnMthd.showToast("Thank you for your feedback");
  }

}
