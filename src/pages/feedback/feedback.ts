import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { commonMethods } from '../../helper/common-methods';
import { AppContextProvider } from '../../providers/app-context/app-context';
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
  user:any = {};
  constructor(public navCtrl: NavController,   private appContext: AppContextProvider,public navParams: NavParams, public _firestore:AngularFirestore,public _CmnMthd:commonMethods) {
    this.user =this.appContext.myProfileObject;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedbackPage');
  }

  submitFeedback()
  {
    var objFeedback={};
    let userId = this.user.email;
    let consUserRef=this._firestore.collection("eUsers").doc(userId).ref;


    objFeedback['title']=this.title;
    objFeedback['description']=this.description;
    objFeedback['postedBy']=consUserRef;
    objFeedback['createdOn']=new Date();
    

    this._firestore.collection('eFeedbacks').add(objFeedback);
    this._CmnMthd.showToast("Thank you for your feedback");
    this.navCtrl.pop();
  }

}
