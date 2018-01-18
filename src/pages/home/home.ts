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

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{  
  cards: any;
  leaves$:Observable<Leave[]>;
  userInfo$:User;
  teamInfo$:any[]= [];
  teamLeaves$:any[] = [];
  loggedInUserId:string = firebase.auth().currentUser.uid; 
  badgeCount:number;
  constructor(
    public navCtrl: NavController,
    public leaveService: LeaveServiceProvider,
    public auth: AuthServiceProvider,
    private userService:UserServiceProvider) {
    this.cards = new Array(10);
    this.bindLeaveCarosol();
    this.getUserContext();
  }

  bindLeaveCarosol(){
    this.leaves$ = this.leaveService.getAllLeaves();
  }

  ionViewDidLoad() {
    this.badgeCount = 0;
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
    .subscribe(result=>{
      this.userInfo$ = _.filter(result, { uid : this.loggedInUserId});
      let isManager:boolean = this.userInfo$[0].isManagerRole;
      let teamId:number = this.userInfo$[0].team;
      localStorage.setItem('isManagerRole',isManager.toString());    
      this.userService.getMyTeam(teamId)
                      .snapshotChanges()
                      .map(changes=>{
                        return changes.map(c=>{
                          this.teamInfo$.push(c.payload.val())
                        })
                      })
                      .subscribe(members=>{
                        this.teamInfo$.forEach(member=>{
                          this.leaveService.getLeavesByUser(member)
                                            .subscribe(()=>{
                                              this.filterLeavesByDate();
                                            });
                  
                        });
                      });
    }); 
  }

  filterLeavesByDate(startDt?:Date, endDate?:Date){
    if(this.teamLeaves$.length > 0){
      //fetch only approved leaves of my team memebers
      let filteredResult =  _.filter(this.teamLeaves$,{ status: 1 });
      return filteredResult;
    }
    return "";
  }

  async ngOnInit(){
    await this.leaveService
              .getBadgeCount(this.loggedInUserId)
              .subscribe(result=>{
                  let record_count:Leave[] = _.filter(result, { 
                                                        status: 0 ,
                                                        requestor : this.loggedInUserId,
                                                        isRead: false
                                                    });                                            
              this.badgeCount = record_count.length;
      });
  }

  SearchRecords(){
    this.navCtrl.push("SearchLeavesPage",{ UserInfo: this.userInfo$[0]});
    // page-search-leaves
  }
}
