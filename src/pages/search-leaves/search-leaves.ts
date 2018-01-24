import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormsModule, NgForm } from '@angular/forms';
import { commonMethods } from '../../helper/common-methods'
import * as _ from 'lodash';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LeaveServiceProvider } from '../../providers/leave-service/leave-service';
import { NotificationService } from '../../providers/notification-service/notification-service';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-search-leaves',
  templateUrl: 'search-leaves.html',
})
export class SearchLeavesPage {
  uid: string;
  Results:any=[];
  isManager:string;
  SearchResults: FormGroup;
  GetCurrentDate: Date = new Date();
  myDate:any  

  constructor(public navCtrl: NavController,
    private _searchService: LeaveServiceProvider,
    private formgroup: FormBuilder,
    private _cmnMethods: commonMethods,private _notify:NotificationService,
    public navParams: NavParams) {
    this.uid = localStorage.getItem('myId');
    this.isManager = localStorage.getItem('isManagerRole') ? localStorage.getItem('isManagerRole') : "false";
    this.myDate= new Date().toISOString();
    this.SearchResults = this.formgroup.group(
      {
        from: [null, Validators.compose ( [ Validators.required ])],
        ToDate:  [null,Validators.compose ( [ Validators.required ])],
      }
    );
  }

  ionViewDidLoad() {
  }

  searchLeave() {
    let from: Date = new Date(this.SearchResults.value['from']);
    let to: Date = new Date(this.SearchResults.value['to']);
    let teamId = localStorage.getItem('myTeam');
    if (this.isManager == 'true' && (from != null && to != null)) {
      this._cmnMethods.InitializeLoader();
      this._searchService.getLeaveByDateRange(true, teamId, from, to,this.uid).subscribe(result => {
        this.Results = _.filter(result, function (query) {
          return query.data.to <= to || query.data.to == from;
        });
        this._cmnMethods.loader.dismiss();
      }, err => {
        console.log(err);
        this._cmnMethods.showToast(err);
      });
    }
    else if (this.isManager == 'false' && (from != null && to != null)) {
      this._cmnMethods.InitializeLoader();
      this._searchService.getLeaveByDateRange(false, teamId, from, to,this.uid).subscribe(result => {
        this.Results = _.filter(result, function (query) {
          return (query.data.from >= from || query.data.to <= to);
        });
        this._cmnMethods.loader.dismiss();
      }, err => {
        console.log(err);
        this._cmnMethods.showToast(err);
      });
    }
  }

  rejectLeave(keyObj:string){
    if(this.isManager == 'false'){
      //let managerId = localStorage.getItem('myManager');
      this._notify.declineLeave(keyObj,true,this.uid);
      this._cmnMethods.showToast('Leave request rejected succesfully');
    }   
  }

  acceptLeave(keyObj:any){
    if(this.isManager == 'false'){
      this.Results.forEach(element => {
        if(element.id == keyObj){
          this.Results.splice(keyObj, 1);
        }
      });
      this._notify.acceptleave(keyObj,true,this.uid);
      this._cmnMethods.showToast('Leave request accepted succesfully');
    }   
  }


}
