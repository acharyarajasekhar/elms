import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { TeamServiceProvider } from '../../providers/team-service/team-service';

@IonicPage()
@Component({
  selector: 'page-edit-user-profile',
  templateUrl: 'edit-user-profile.html',
})
export class EditUserProfilePage {

  profileForm: FormGroup;
  user:any = {};
  managers$: any[]=[];
  teams$: any[]=[];
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public userService: UserServiceProvider,
    private teamService:TeamServiceProvider,
    public authService: AuthServiceProvider) {
      this.profileForm = this.formBuilder.group({
        name: ['', Validators.required],
        manager: [''],
        team: [''],
        phoneNumber: ['']
      });
      this.user = JSON.parse(localStorage.getItem('userContext'));
  }
  
  updateProfile(){    
    localStorage.setItem('mgrEmail', this.user.manager);
    localStorage.setItem('teamId', this.user.team);
    localStorage.setItem('teamName', this.user.manager);
    localStorage.setItem('mgrName', this.user.team);
    this.userService.updateUserById(this.user.email,this.user);
    this.navCtrl.push("UserProfilePage",{user: this.user});
  }

  ionViewDidLoad() {
  }

  ngOnInit(){ 
    this.user.manager = localStorage.getItem("mgrEmail");
    this.user.team = localStorage.getItem("teamId");
    this.userService.getManagers().subscribe(mgrs=>{      
      this.managers$ = mgrs;      
    });
    this.teamService.getTeams().subscribe(teams=>{
      this.teams$ = teams;   
    });
  }

  onChange(mgrId){
    this.teams$ = [];
    this.teamService.getTeams().subscribe(teams=>{
      teams.forEach((tmItem:any)=>{
        tmItem.managerid.get()
        .then(userRef => { 
            if(userRef.data().email == mgrId){
              this.teams$.push(tmItem);
            }
        });
      });  
    });
  }
}
