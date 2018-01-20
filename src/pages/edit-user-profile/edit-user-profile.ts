import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import * as firebase from 'firebase';
import { User } from '../../models/user.model';
import { Team } from '../../models/team.model';
import { TeamServiceProvider } from '../../providers/team-service/team-service';

@IonicPage()
@Component({
  selector: 'page-edit-user-profile',
  templateUrl: 'edit-user-profile.html',
})
export class EditUserProfilePage {

  profileForm: FormGroup;
  user: User;  
  managers$: any[]=[];
  teams$: any[]=[];
  uid:string = localStorage.getItem('myId');
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public userService: UserServiceProvider,
    private teamService:TeamServiceProvider,
    public authService: AuthServiceProvider) {
      this.profileForm = this.formBuilder.group({
        name: ['', Validators.required],
        manager: ['', Validators.required],
        team: ['', Validators.required]
      });
  }
  
  updateProfile(){
    this.userService.updateUserById(this.uid,this.profileForm.value);
  }

  ionViewDidLoad() {
  }

  ngOnInit(){ 
    this.userService.getManagers().subscribe(mgrs=>{
      this.managers$ = mgrs;
    });
  }

  onChange(mgrId){
    this.teamService.getTeamsByManager(mgrId).subscribe(team=>{
        this.teams$ = team;  
    });
  } 

}
