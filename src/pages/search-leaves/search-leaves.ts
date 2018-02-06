import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { FormsModule, NgForm } from '@angular/forms';
import { commonMethods } from '../../helper/common-methods';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from '../../providers/notification-service/notification-service';
import { DetailsviewPage } from '../detailsview/detailsview';
import {searchservice} from '../../providers/search-service/search-service';
import { Observable } from 'rxjs/Rx';
import { AlertController } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-search-leaves',
  templateUrl: 'search-leaves.html'
})
export class SearchLeavesPage {
  UserDetails: any;
  SearchResults: FormGroup;
  GetCurrentDate: Date = new Date();
  myDate:any;
  myToDate:any;
  IsearchResults:Observable<any>;
  check:boolean=true;
  managerId:string;
  teamId:string;
  public edited = false;

  constructor(public navCtrl: NavController,
    private formgroup: FormBuilder,public modalCtrl: ModalController,
    private _cmnMethods: commonMethods,private _notify:NotificationService,private _search:searchservice,
    public navParams: NavParams, private alertCtrl: AlertController) {
    this.UserDetails = localStorage.getItem('userContext') ? JSON.parse(localStorage.getItem('userContext')) : null;
     this.managerId =  localStorage.getItem('mgrEmail') ?localStorage.getItem('mgrEmail') : null;
     this.teamId= localStorage.getItem('teamId') ?localStorage.getItem('teamId') : null;
    this.myDate= new Date().toISOString();
    this.myToDate=new Date().toISOString();
    this.SearchResults = this.formgroup.group(
      {
        from: [null, Validators.compose ( [ Validators.required ])],
        ToDate:  [null,Validators.compose ( [ Validators.required])],
      }
    );
     this._search.getLeavesCollections()
      .subscribe(Leaves=>{
        
        if(Leaves.length>0)
        {
      this.IsearchResults =Leaves;
      this.edited=false;
        }
      else
      {
      this.edited=true;
      this.IsearchResults =Leaves;
      }
      this._cmnMethods.loader.dismiss();
      })
  }
  
  validateDate()
  {
   if(this.myToDate < this.myDate)
   {
    this.check= false;
   }
   else
   {
    this.check=true;
   }
  }

  ionViewDidLoad() {
  }

  searchLeave() {
    let from: Date = new Date(this.SearchResults.value['from']);
    let to: Date = new Date(this.SearchResults.value['ToDate']);
    this._cmnMethods.InitializeLoader();
    this._search.getSearchresults(this.UserDetails.isManager,this.teamId,this.managerId,from,to);
  }

  getColor(status)
  {

switch(status)
{
case 0:
return 'gray';
case 1:
return 'green';
case 2:
return 'red';
default:
return 'orange';
}
}


presentPrompt(keyObj:string) {
  let alert = this.alertCtrl.create({
    title: 'Reject Leave',
    message: 'Do you wish to reject this leave request?',
    cssClass: 'alertCustomCss',
    inputs: [
      {
        name: 'comments',
        placeholder: 'Comments'
      }
    ],
    buttons: [
      {
        text: 'Dismiss',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
       text: 'Save',
        handler: data => {
          this.rejectLeave(keyObj,data.comments);
        }
      }
    ]
  });
  alert.present();
}


  rejectLeave(keyObj:string,info:string){
    if(this.UserDetails.isManager){
      this._notify.declineLeave(keyObj,true,info);
      this._cmnMethods.showToast('Leave request rejected succesfully');
    }   
  }

  acceptLeave(keyObj:any){

    if(this.UserDetails.isManager){
      this._notify.acceptleave(keyObj,true,this.managerId);
      this._cmnMethods.showToast('Leave request accepted succesfully');
    }   
  }

  MoreInfo(obj:any)
  {
  
    let leaveObj = { 
      name: obj.owner.name, 
      from: obj.from, 
      to: obj.to, 
      reason: obj.reason, 
      photoUrl:obj.owner.photoUrl,
      teamId:this.teamId,
      ManagerEmail:this.managerId
    };
let myModal = this.modalCtrl.create(DetailsviewPage,leaveObj);
myModal.present();
  }

}
