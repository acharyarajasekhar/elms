import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { AppContextProvider } from '../../providers/app-context/app-context';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private slides: Array<string> = [
    "assets/imgs/lms1.jpg",
    "assets/imgs/lms2.jpg",
    "assets/imgs/lms3.jpg",
    "assets/imgs/lms4.jpg",
    "assets/imgs/lms5.jpg",
    "assets/imgs/lms6.jpg",
    "assets/imgs/lms7.jpg"
  ];

  constructor(
    public navCtrl: NavController,
    private appContext: AppContextProvider) {

  }

  goToPage(pageName) {
    this.navCtrl.push(pageName);
  }
}
