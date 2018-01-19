import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { User } from '../../models/user.model';
import * as firebase from "firebase";
import * as _ from "lodash";

@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage implements OnInit {

  user: User;
  teams: any[];
  profileForm: FormGroup;
  managerName: string;
  teamName: string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public userService: UserServiceProvider) {
      this.profileForm = this.formBuilder.group({
        name: ['', Validators.required],
        manager: ['', Validators.required],
        team: ['', Validators.required]
      });
  }

  ionViewDidLoad() {    
  }

  editProfile(){
    this.navCtrl.push("EditUserProfilePage", {user: this.user});
  }

  ngOnInit(){
    var obj = localStorage.getItem('loggedInUser');       
    this.user = JSON.parse(obj);    
    this.managerName = localStorage.getItem('managerName');
    this.getTeams();
  }

  getTeams(){
    this.userService.getTeams()
    .subscribe(team=>{
      this.teams =  _.filter(team, { key : localStorage.getItem('myTeam')});      
      this.teamName = this.teams[0].team;
    });
  }
}
