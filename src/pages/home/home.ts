import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {  

  constructor(public navCtrl: NavController,
  private authService: AuthServiceProvider) {

  }

  openNotifications() {
    this.navCtrl.push("NotificationsPage");
  }

  openNewLeave() {
    this.navCtrl.push("NewLeavePage");
  }

}
