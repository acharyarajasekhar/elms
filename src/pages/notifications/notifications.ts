import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { NotificationService } from '../../providers/notification-service/notification-service';
import { LeaveServiceProvider } from '../../providers/leave-service/leave-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { User } from '../../models/user.model';
import { Leave } from '../../models/leave.model';
import * as _ from "lodash";
import * as firebase from "firebase";


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
  isManagerRole:boolean;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private notificationService:NotificationService,
    private userService:UserServiceProvider,
    private leaveService:LeaveServiceProvider
  ) {
    this.loggedInUserId = firebase.auth().currentUser.uid;
    this.isManagerRole = <any>localStorage.getItem('isManagerRole');
    this.bindNotificationList();
  }

  bindNotificationList(){
    this.leaveService
        .getLeavesByUser()
        .snapshotChanges()
        .map(
          changes=>{
          return changes.map(c=>(
            {key:c.payload.key,...c.payload.val()}
          ))
        }).subscribe(result=>{
             let unSorted:Leave[] = _.filter(result, { 
                                                        status: 0 ,//pending leaves
                                                        requestor : this.loggedInUserId,
                                                        isRead: false
                                                     });
             localStorage.setItem('badgeCount',unSorted.length.toString())                                                
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
      if(!this.isManagerRole && this.isManagerRole == true)
        this.notificationService.declineLeave(keyObj,true);
      else
        this.notificationService.declineLeave(keyObj,false);
    }
    if (event.direction == 4){ //(4)swipe right direction ~ accept
      if(!this.isManagerRole && this.isManagerRole == false)
        this.notificationService.acceptleave(keyObj,true);
      else
        this.notificationService.acceptleave(keyObj,false);
    } 
  }

  rejectLeave(keyObj){
    if(this.isManagerRole){
      this.notificationService.declineLeave(keyObj,true);
    }   
    else{
      this.notificationService.declineLeave(keyObj,false);
    }
  }

  acceptLeave(keyObj){
    if(this.isManagerRole){
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
      this.isManagerRole = Boolean(localStorage.getItem('isManagerRole'));
    }
  }

}
