import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { LeaveServiceProvider } from '../../providers/leave-service/leave-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Observable } from 'rxjs/Observable';
import { Leave } from '../../models/leave.model';
import * as _ from "lodash";
import * as firebase from "firebase";
import { UserServiceProvider } from '../../providers/user-service/user-service';
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {  
  cards: any;
  leaves$:Observable<Leave[]>;
  userInfo$;
  constructor(
    public navCtrl: NavController,
    private authService: AuthServiceProvider,
    public leaveService: LeaveServiceProvider,
    private userService:UserServiceProvider) {
    this.cards = new Array(10);
    this.leaves$ = this.leaveService
        .getAllLeaves()
        .snapshotChanges()
        .map(
          changes=>{
          return changes.map(c=>({
                key:c.payload.key,...c.payload.val()
          }))
        });
    this.getUserContext();
  }

  openNotifications() {
    this.navCtrl.push("NotificationsPage",{ name: this.userInfo$[0].name, photoUrl:this.userInfo$[0].photoUrl });
  }

  openNewLeave() {
    this.navCtrl.push("NewLeavePage");
  }

  getUserContext(){
    this.userService.getUserByUID()
    .subscribe(result=>{
      this.userInfo$ = _.filter(result, { uid : firebase.auth().currentUser.uid}); 
    });
  }
}
