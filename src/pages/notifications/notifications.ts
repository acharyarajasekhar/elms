import { Component, OnInit } from '@angular/core';
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
export class NotificationsPage implements OnInit{
  leaves$:any;
  photoUrl:string = "";
  UserContext:any;
  userId:string;
  loggedInUserId:string;
  managerUserId:string;
  userName:string;
  isManagerRole:string;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private notificationService:NotificationService,
    private userService:UserServiceProvider
  ) {
    this.loggedInUserId = firebase.auth().currentUser.uid;
    this.isManagerRole = localStorage.getItem('isManagerRole');
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
             let unSorted:Leave[] = _.filter(result, { status: 0 ,requestor : this.loggedInUserId,isRead: false});
             this.leaves$ = _.orderBy(unSorted, ['from'], ['asc']); 
        });
  }

  ionViewDidLoad() {
    this.userName = this.navParams.get('name');
    this.navParams.get('photoUrl') == ""?
          this.photoUrl = "http://www.4akb.ru/default-icon.png": 
          this.photoUrl = this.navParams.get('photoUrl');
  }

  swipeEvent(event,keyObj){
    if (event.direction == 2){ //(2)swipe left direction ~ reject
      if(!this.isManagerRole && this.isManagerRole == "true")
        this.notificationService.declineLeave(keyObj,true);
      else
        this.notificationService.declineLeave(keyObj,false);
    }
    if (event.direction == 4){ //(4)swipe right direction ~ accept
      if(!this.isManagerRole && this.isManagerRole == "false")
        this.notificationService.acceptleave(keyObj,true);
      else
        this.notificationService.acceptleave(keyObj,false);
    } 
  }

  rejectLeave(keyObj){
    if(this.isManagerRole != "" && this.isManagerRole == "true"){
      this.notificationService.declineLeave(keyObj,true);
    }   
    else{
      this.notificationService.declineLeave(keyObj,false);
    }
  }

  acceptLeave(keyObj){
    if(this.isManagerRole != "" && this.isManagerRole == "true"){
      this.notificationService.acceptleave(keyObj,true);
    }   
    else{
      this.notificationService.acceptleave(keyObj,false);
    }
  }

  readOnly(keyObj){
    this.notificationService.archieveLeave(keyObj);
  }

  ngOnInit(){
    if(this.loggedInUserId == "" || this.loggedInUserId == null){
      this.loggedInUserId = firebase.auth().currentUser.uid;
      this.isManagerRole = localStorage.getItem('isManagerRole');
    }
  }

}
