import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { TeamServiceProvider } from '../../providers/team-service/team-service';
import { AppContextProvider } from '../../providers/app-context/app-context';
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
    private appContext: AppContextProvider,
    public authService: AuthServiceProvider) {
      this.profileForm = this.formBuilder.group({
        name: ['', Validators.required],
        // manager: [{value: '',disabled: true}],
        // team: [{value: '',disabled: true}],
        phoneNumber: ['']
      });
      this.user =this.appContext.myProfileObject;
  }
  
  updateProfile(){   
    this.userService.updateUserById(this.user.email,this.user);
    //this.navCtrl.push("UserProfilePage",{user: this.user});
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
  }

  // ngOnInit(){ 
  //   this.userService.getManagers().subscribe(mgrs=>{      
  //     this.managers$ = mgrs;      
  //   });
  //   this.teamService.getTeams().subscribe(teams=>{
  //     this.teams$ = teams;   
  //   });
  // }

  // onChange(mgrId){
  //   this.teams$ = [];
  //   this.teamService.getTeams().subscribe(teams=>{
  //     teams.forEach((tmItem:any)=>{
  //       tmItem.managerid.get()
  //       .then(userRef => { 
  //           if(userRef.data().email == mgrId){
  //             this.teams$.push(tmItem);
  //           }
  //       });
  //     });  
  //   });
  // }
}
