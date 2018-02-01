import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { FormsModule, NgForm } from '@angular/forms';
import { commonMethods } from '../../helper/common-methods'
import * as _ from 'lodash';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LeaveServiceProvider } from '../../providers/leave-service/leave-service';
import { NotificationService } from '../../providers/notification-service/notification-service';
import { DetailsviewPage } from '../detailsview/detailsview';
import {serachservice} from '../../providers/search-service/search-service';
import { ISubscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Rx';



@IonicPage()
@Component({
  selector: 'page-search-leaves',
  templateUrl: 'search-leaves.html'
  // animations: [
  //   trigger('popOverState', [
  //     state('show', style({
  //       transform: 'scale(1.0)'
  //     })),
  //     state('hide',   style({
  //       transform: 'scale(1.5)'
  //     })),
  //     transition('show => hide', animate('600ms ease-out')),
  //     transition('hide => show', animate('1000ms ease-in'))
  //   ])
  // ]
})
export class SearchLeavesPage {
  uid: string;
  Results: any = [];
  isManager: string;
  SearchResults: FormGroup;
  GetCurrentDate: Date = new Date();
  myDate:any;
  myToDate:any;
  IsearchResults:Observable<any>;

  constructor(public navCtrl: NavController,
    private _searchService: LeaveServiceProvider,
    private formgroup: FormBuilder,public modalCtrl: ModalController,
    private _cmnMethods: commonMethods,private _notify:NotificationService,private _search:serachservice,
    public navParams: NavParams) {
    this.uid = localStorage.getItem('myId');
    this.isManager = localStorage.getItem('isManagerRole') ? localStorage.getItem('isManagerRole') : "true";
    console.log(this.isManager);
    this.myDate= new Date().toISOString();
    this.myToDate=new Date().toISOString();
    this.SearchResults = this.formgroup.group(
      {
        from: [null, Validators.compose ( [ Validators.required ])],
        ToDate:  [null,Validators.compose ( [ Validators.required ])],
      }
    );
     this._search.getLeavesCollections()
      .subscribe(Leaves=>{
      this.IsearchResults =Leaves;
      this._cmnMethods.loader.dismiss();
      })
  }



  ionViewDidLoad() {
  }

  searchLeave() {
    let from: Date = new Date(this.SearchResults.value['from']);
    let to: Date = new Date(this.SearchResults.value['ToDate']);
    this._cmnMethods.InitializeLoader();
     this._search.getSearchresults(true,"",from,to);
    //this._search.getbyManagerId(true,"aasif2707@gmail.com",from,to);
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

  rejectLeave(keyObj:string){
    if(this.isManager == 'true'){
      //let managerId = localStorage.getItem('myManager');
      this._notify.declineLeave(keyObj,true,this.uid);
      this._cmnMethods.showToast('Leave request rejected succesfully');
    }   
  }

  acceptLeave(keyObj:any){

    if(this.isManager == 'true'){
      this._notify.acceptleave(keyObj,true,this.uid);
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
      photoUrl:obj.owner.photoUrl
    };
let myModal = this.modalCtrl.create(DetailsviewPage,leaveObj);
myModal.present();
  }

}
