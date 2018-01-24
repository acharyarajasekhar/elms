import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { TeamServiceProvider } from '../../providers/team-service/team-service';
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/observable/forkJoin";
import { User } from './../../models/user.model';
import { Team } from '../../models/team.model';

@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {

  profileForm: FormGroup;
  uid:string = localStorage.getItem('myId');
  user:any = {};
  userCtx:User;
  teamName:string;
  managerName:string;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private teamService: TeamServiceProvider,
    public userService: UserServiceProvider,
    public toastCtrl: ToastController,
    public authService: AuthServiceProvider) {      
  }

  ionViewDidLoad() {    
  }

  editProfile(){
    this.navCtrl.push("EditUserProfilePage",{user: this.user});
  }

  async ngOnInit(){          
  if(this.navParams.get('user') != null){
    this.user = this.navParams.get('user');
  }
  else{
    this.user = {    
      name: (localStorage.getItem('myName')!= "" || localStorage.getItem('myName') == 'null') ?localStorage.getItem('myName') : "N.A",
      photoUrl: (localStorage.getItem('myphotoUrl') != "" || localStorage.getItem('myphotoUrl') == 'null') ?localStorage.getItem('myphotoUrl') : "N.A",
      email: (localStorage.getItem('myEmail') !="" || localStorage.getItem('myEmail') == 'null') ?localStorage.getItem('myEmail'): "N.A",
      phoneNumber: (localStorage.getItem('myMobile') !="" || localStorage.getItem('myMobile') == 'null') ? localStorage.getItem('myMobile'): "N.A",
      team: (localStorage.getItem('myTeam') !="" || localStorage.getItem('myTeam') == 'null') ? localStorage.getItem('myTeam'): "",
      manager: (localStorage.getItem('myManager') !="" || localStorage.getItem('myManager') == 'null') ? localStorage.getItem('myManager'): ""
    };
  }  

  if(this.user.team != ""){
    await this.getTeam$(this.user.team)
    .subscribe(tm=>{ 
      this.teamName = tm.name;
    })}

  if(this.user.manager != ""){
    await this.getManager$(this.user.manager)
    .subscribe(mgr=>{ 
      this.managerName = mgr.name;
    })}
  }

  getManager$(uid:string){
    return this.userService.getMyManager(uid);
  }

  getTeam$(teamId:string){
    return this.teamService.getTeamByKey(teamId);
  }

  showToast(alert_message:string){
    let toast = this.toastCtrl.create({
      message: alert_message,
      duration: 2000,
      position: 'bottom'
    }); 
    toast.present(toast);
  }
}
