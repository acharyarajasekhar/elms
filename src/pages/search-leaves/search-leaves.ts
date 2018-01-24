import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { commonMethods } from '../../helper/common-methods'
import * as _ from 'lodash';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LeaveServiceProvider } from '../../providers/leave-service/leave-service';

@IonicPage()
@Component({
  selector: 'page-search-leaves',
  templateUrl: 'search-leaves.html',
})
export class SearchLeavesPage {
  uid: string;
  Results;
  SearchResults: FormGroup;
  GetCurrentDate: Date = new Date();

  constructor(public navCtrl: NavController,
    private _searchService: LeaveServiceProvider,
    private formgroup: FormBuilder,
    private _cmnMethods: commonMethods,
    public navParams: NavParams) {
    this.uid = localStorage.getItem('myId');
    this.SearchResults = this.formgroup.group(
      {
        from: [this.GetCurrentDate, Validators.required],
        to: [this.GetCurrentDate, Validators.required],
      }
    );
  }

  ionViewDidLoad() {
  }

  searchLeave() {
    let from: Date = new Date(this.SearchResults.value['from']);
    let to: Date = new Date(this.SearchResults.value['to']);
    let teamId = localStorage.getItem('myTeam');
    let isManager = localStorage.getItem('isManagerRole');
    if (isManager == 'true' && (from != null && to != null)) {
      this._cmnMethods.InitializeLoader();
      this._searchService.getLeaveByDateRange(true, teamId, from, to,this.uid).subscribe(result => {
        this.Results = _.filter(result, function (query) {
          return query.to <= to || query.to == from;
        });
        this._cmnMethods.loader.dismiss();
      }, err => {
        console.log(err);
        this._cmnMethods.showToast(err);
      });
    }
    else if (isManager == 'false' && (from != null && to != null)) {
      this._cmnMethods.InitializeLoader();
      this._searchService.getLeaveByDateRange(false, teamId, from, to,this.uid).subscribe(result => {
        this.Results = _.filter(result, function (query) {
          return (query.from == to || query.to <= to);
        });
        this._cmnMethods.loader.dismiss();
      }, err => {
        console.log(err);
        this._cmnMethods.showToast(err);
      });
    }
  }

}
