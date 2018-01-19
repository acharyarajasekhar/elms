import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { LeaveServiceProvider } from '../../providers/leave-service/leave-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Observable } from 'rxjs/Observable';
import { Leave } from '../../models/leave.model';
import * as _ from "lodash";
import * as firebase from "firebase";
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { User } from '../../models/user.model';
import { Team } from '../../models/team.model';
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{  
  cards: any;
  leaves$:Observable<Leave[]>;
  userInfo$:User;
  managerInfo$:User;
  teamInfo$:User[]= [];
  teamLeaves$:any[] = [];
  loggedInUserId:string;
  teamDetails$:Team;

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
    this.loggedInUserId = firebase.auth().currentUser.uid;
    this.getUserContext();
  }

  openNotifications() {
    this.navCtrl.push("NotificationsPage",{ name: this.userInfo$[0].name, photoUrl:this.userInfo$[0].photoUrl });
  }

  openReports() {
    this.navCtrl.push("ReportPage",{ userCtx: this.userInfo$[0] });
  }

  openNewLeave() {
    this.navCtrl.push("NewLeavePage");
  }

  getUserContext(){
    this.userService.getUsersInfo()
    .subscribe(user=>{
      this.userInfo$ = _.filter(user, { uid : this.loggedInUserId});
      let isManager = this.userInfo$[0].isManagerRole;
      let myTeam = this.userInfo$[0].team;
      localStorage.setItem('loggedInUser',JSON.stringify(this.userInfo$[0]));      
      localStorage.setItem('isManagerRole',''+isManager+'');
      localStorage.setItem('myTeam',myTeam);
      localStorage.setItem('managerId',this.userInfo$[0].manager);   

      this.userService.getUsersInfo()
      .subscribe(manager=>{
        this.managerInfo$ = _.filter(manager, { uid : localStorage.getItem('managerId')});      
        localStorage.setItem('managerName', this.managerInfo$[0].name);
      });
    });
  }

  getTeamMembers(){
    this.userService.getUsersInfo()
    .subscribe(result=>{
      //get my team memebers from list of users
      this.teamInfo$ = _.filter(result, { team : localStorage.getItem('myTeam')});
    });
  }

  getMyTeamLeaves(){
    //get all leaves for each users
    this.teamInfo$.forEach(u=>{
      this.leaveService.getLeaveListByUID(u.uid)
                      .snapshotChanges()
                      .map(changes=>{
                        return changes.map(c=>({
                          key:c.payload.key,...c.payload.val()
                        }))
                      })
                      .subscribe(leaves=>{
                          this.teamLeaves$.push(leaves);//my team leaves array
                      });
    });
  }

  filterLeavesByDate(startDt:Date, endDate:Date){
    if(this.teamLeaves$.length > 0){
      //fetch only approved leaves of my team memebers
      let filteredResult =  _.filter(this.teamLeaves$,{ from:startDt, status: 1 });
      return filteredResult;
    }
    return "";
  }

  ngOnInit(){
    if(this.loggedInUserId === "" || this.loggedInUserId === null){
      this.loggedInUserId = firebase.auth().currentUser.uid;
    }
  }
}
