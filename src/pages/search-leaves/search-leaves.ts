import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { FormsModule, NgForm } from '@angular/forms';
import { commonMethods } from '../../helper/common-methods'
import * as _ from 'lodash';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LeaveServiceProvider } from '../../providers/leave-service/leave-service';
import { NotificationService } from '../../providers/notification-service/notification-service';
//import {trigger, transition, style,state, animate} from "@angular/animations";
//import {NotificationsPage} from '../notifications/notifications';
import { DetailsviewPage } from '../detailsview/detailsview';



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
  myDate: any
  show = true;
  get stateName() {
    return this.show ? 'show' : 'hide'
  }
  toggle() {
    this.show = !this.show;
  }
  constructor(public navCtrl: NavController,
    private _searchService: LeaveServiceProvider,
    private formgroup: FormBuilder, public modalCtrl: ModalController,
    private _cmnMethods: commonMethods, private _notify: NotificationService,
    public navParams: NavParams) {
    this.uid = localStorage.getItem('myId');
    this.isManager = localStorage.getItem('isManagerRole') ? localStorage.getItem('isManagerRole') : "true";
    console.log(this.isManager);
    this.myDate = new Date().toISOString();
    this.SearchResults = this.formgroup.group(
      {
        from: [null, Validators.compose([Validators.required])],
        ToDate: [null, Validators.compose([Validators.required])],
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
      this._searchService.getLeaveByDateRange(true, teamId, from, to, this.uid).subscribe(result => {
        this.Results = _.filter(result, function (query) {
          return (query.data.from >= from || query.data.to <= to);
        });
        this._cmnMethods.loader.dismiss();
      }, err => {
        console.log(err);
        this._cmnMethods.showToast(err);
      });
    }
    else if (this.isManager == 'false' && (from != null && to != null)) {
      this._cmnMethods.InitializeLoader();
      this._searchService.getLeaveByDateRange(false, teamId, from, to, this.uid).subscribe(result => {
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
  getColor(status) {
    switch (status) {
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
  rejectLeave(keyObj: string) {
    if (this.isManager == 'true') {
      //let managerId = localStorage.getItem('myManager');
      this._notify.declineLeave(keyObj, true, this.uid);
      this._cmnMethods.showToast('Leave request rejected succesfully');
    }
  }

  acceptLeave(keyObj: any) {
    this.show = !this.show;
    if (this.isManager == 'true') {
      this.Results.forEach(element => {
        if (element.id == keyObj) {
          this.Results.splice(keyObj, 1);
        }
      });
      this._notify.acceptleave(keyObj, true, this.uid);
      this._cmnMethods.showToast('Leave request accepted succesfully');
    }
  }

  MoreInfo(obj: any) {
    let leaveObj = {
      userId: obj.userId,
      name: obj.name,
      from: obj.from,
      to: obj.to,
      reason: obj.reason,
      photoUrl: obj.photoUrl
    };
    let myModal = this.modalCtrl.create(DetailsviewPage, obj);
    myModal.present();
  }

}
