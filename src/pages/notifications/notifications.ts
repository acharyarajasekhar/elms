import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Leave } from '../../models/leave.model';
import { NotificationService } from '../../providers/notification-service/notification-service';
import * as _ from "lodash";
import * as firebase from "firebase";
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { User } from '../../models/user.model';

@IonicPage()
@Component({
  selector: 'page-notifications', 
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
  leaves$:any;
  photoUrl:string = "";
  UserContext:User;
  userId:string;
  loggedInUserId:string;
  managerUserId:string;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private notificationService:NotificationService,
    private userService:UserServiceProvider
  ) {
    this.loggedInUserId = firebase.auth().currentUser.uid;
    //this.UserContext = this.userService.getUserByUID(this.loggedInUserId);
    // if(this.UserContext.manager && this.UserContext.manager != null){
    //   this.managerUserId = this.userService.getUserContext(this.UserContext.manager).uid;
    //   this.userId = this.managerUserId;
    // }
    // else{
    //   this.userId = this.loggedInUserId;
    // } 
    this.notificationService
        .getAllPendingLeaves()
        .snapshotChanges()
        .map(
          changes=>{
          return changes.map(c=>(
            {key:c.payload.key,...c.payload.val()}
          ))
        }).subscribe(result=>{
             let unSorted:Leave[] = _.filter(result, { status: 0 ,requestor : this.loggedInUserId});
             this.leaves$ = _.orderBy(unSorted, ['from'], ['asc']); 
        });
  }

  ionViewDidLoad() {
    this.photoUrl ==""? this.photoUrl = "http://www.4akb.ru/default-icon.png": this.photoUrl;
  }

  getUserDetails(uid :string){
    // this.notificationService.getRequestorDetails(uid).snapshotChanges().subscribe(user=>{
    //   console.log(user.payload.val());
    // });
  }

  swipeEvent(event,keyObj){
    if (event.direction == 2){ //(2)swipe left direction ~ reject
      this.notificationService.declineLeave(keyObj);
    }
    if (event.direction == 4){ //(4)swipe right direction ~ accept
      this.notificationService.acceptleave(keyObj);
    } 
  }

}
