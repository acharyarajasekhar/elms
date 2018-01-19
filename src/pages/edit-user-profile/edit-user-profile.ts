import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { User } from '../../models/user.model';
import { Team } from '../../models/team.model';
import * as _ from "lodash";
import * as firebase from "firebase";

@IonicPage()
@Component({
  selector: 'page-edit-user-profile',
  templateUrl: 'edit-user-profile.html',
})
export class EditUserProfilePage implements OnInit {

  profileForm: FormGroup;
  user: User;  
  managers: User[];
  teams: Team[];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public userService: UserServiceProvider,
    public authService: AuthServiceProvider) {
      this.profileForm = this.formBuilder.group({
        name: ['', Validators.required],
        manager: ['', Validators.required],
        team: ['', Validators.required]
      });
  }
  
  updateProfile(){    
    this.userService.updateUser(this.user).then(() => {
      this.navCtrl.setRoot('UserProfilePage');
    });
  }
  
  ngOnInit(){    
    this.user = this.navParams.get('user');
    this.getManagers();
    this.getTeams();
  }

  getManagers(){
    this.userService.getUsersInfo()
    .subscribe(user=>{
      this.managers = _.filter(user, { isManagerRole : true});      
    });
  }

  getTeams(){
    this.userService.getTeams()
    .subscribe(team=>{
      this.teams = team;      
    });
  } 
}
