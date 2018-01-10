import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {  
  cards: any;
  constructor(public navCtrl: NavController,
  private authService: AuthServiceProvider) {
    this.cards = new Array(10);
  }

  openNotifications() {
    this.navCtrl.push("NotificationsPage");
  }

  openNewLeave() {
    this.navCtrl.push("NewLeavePage");
  }

}
