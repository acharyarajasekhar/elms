import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';



/**
 * Generated class for the SearchLeavesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search-leaves',
  templateUrl: 'search-leaves.html',
})
export class SearchLeavesPage {
Userdetails:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
   // console.log('ionViewDidLoad SearchLeavesPage');
   this.Userdetails=this.navParams.get('UserInfo');
  }

}
