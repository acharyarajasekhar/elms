import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { TeamServiceProvider } from '../../providers/team-service/team-service';
import { Observable } from 'rxjs/Observable';
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
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private teamService: TeamServiceProvider,
    public userService: UserServiceProvider,
    public toastCtrl: ToastController,
    public authService: AuthServiceProvider) {
      this.profileForm = this.formBuilder.group({
        name: ['', Validators.required],
        manager: ['', Validators.required],
        team: ['', Validators.required]
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserProfilePage');
  }

  editProfile(){
    this.navCtrl.push("EditUserProfilePage",{userCtx: this.user});
  }

  async ngOnInit(){    
  let teamId = localStorage.getItem('myTeam');
  this.user = {
    name: (localStorage.getItem('myName')!= "" || localStorage.getItem('myName') == 'null') ?localStorage.getItem('myName') : "N.A",
    photoUrl: (localStorage.getItem('myphotoUrl') != "" || localStorage.getItem('myphotoUrl') == 'null') ?localStorage.getItem('myphotoUrl') : "N.A",
    email: (localStorage.getItem('myEmail') !="" || localStorage.getItem('myEmail') == 'null') ?localStorage.getItem('myEmail'): "N.A",
    mobile: (localStorage.getItem('myMobile') !="" || localStorage.getItem('myMobile') == 'null') ? localStorage.getItem('myMobile'): "N.A"
  };

  await this.getTeam$(teamId)
    .subscribe((tm=>{ this.getManager$(tm.manager)
      .subscribe(mgr=>{
          localStorage.setItem('teamName',tm.name);
          localStorage.setItem('managerName',mgr.name);
          this.user.managerName = mgr.name;
          this.user.teamName = tm.name;
      })
    }))
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
