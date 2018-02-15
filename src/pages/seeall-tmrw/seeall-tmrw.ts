import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppContextProvider } from '../../providers/app-context/app-context';
@IonicPage()
@Component({
  selector: 'page-seeall-tmrw',
  templateUrl: 'seeall-tmrw.html',
})
export class SeeAllTmrwPage {
  constructor(public navCtrl: NavController,
    private appContext: AppContextProvider,
    public navParams: NavParams) {  
  }
}
