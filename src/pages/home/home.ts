import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { LeaveServiceProvider, Leave } from '../../providers/leave-service/leave-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Observable } from 'rxjs/Observable';
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {  
  cards: any;
  leaves$:Observable<Leave[]>;
  constructor(public navCtrl: NavController,
  private authService: AuthServiceProvider,public leaveService: LeaveServiceProvider) {
    this.cards = new Array(10);
    debugger;
    this.leaves$ = this.leaveService
        .getAllLeaves()
        .snapshotChanges()
        .map(
          changes=>{
          //this.photoUrl = "";//to do
          return changes.map(c=>({
                key:c.payload.key,...c.payload.val()
          }))
        });
  }

  openNotifications() {
    this.navCtrl.push("NotificationsPage");
  }

  openNewLeave() {
    this.navCtrl.push("NewLeavePage");
  }

}
