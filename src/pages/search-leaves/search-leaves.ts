import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { LeaveServiceProvider } from '../../providers/leave-service/leave-service';
import { FormsModule, NgForm } from '@angular/forms';
import { formatDateUsingMoment } from '../../helper/date-formatter';
import * as _ from 'lodash';

@IonicPage()
@Component({
  selector: 'page-search-leaves',
  templateUrl: 'search-leaves.html',
})
export class SearchLeavesPage {
  uid: string;
  month$;
  year$;
  day$;
  leaves$;
  fromYr: string = ""; fromDay: string = ""; fromMonth: string = "";
  toYr: string = ""; toDay: string = ""; toMonth: string = "";
  startDate: string = "";
  endDate: string = "";
  constructor(public navCtrl: NavController,
    private leaveService: LeaveServiceProvider,
    public toastCtrl: ToastController,
    public navParams: NavParams) {
    this.uid = localStorage.getItem('myId');
    this.loadMonth();
    this.loadYear();
    this.loadDay();
  }

  ionViewDidLoad() {
  }

  loadMonth() {
    this.month$ = [
      { text: 'January', value: '01' },
      { text: 'February', value: '02' },
      { text: 'March', value: '03' },
      { text: 'April', value: '04' },
      { text: 'May', value: '05' },
      { text: 'June', value: '06' },
      { text: 'July', value: '07' },
      { text: 'August', value: '08' },
      { text: 'September', value: '09' },
      { text: 'October', value: '10' },
      { text: 'November', value: '11' },
      { text: 'December', value: '12' }
    ];
  }

  loadYear() {
    this.year$ = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
  }

  loadDay() {
    this.day$ = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
  }

  yearFromChange(event$) {
    this.fromYr = event$;
  }

  dayFromChange(event$) {
    this.fromDay = event$;
  }

  monthFromChange(event$) {
    this.fromMonth = event$;
  }

  yearToChange(event$) {
    this.toYr = event$;
  }

  dayToChange(event$) {
    this.toDay = event$;
  }

  monthToChange(event$) {
    this.toMonth = event$;
  }

  searchLeave() {
    let teamId = localStorage.getItem('myTeam');
    let isManager = localStorage.getItem('isManagerRole');
    if ((this.fromMonth != "" && this.fromDay != "" && this.fromYr != "") &&
      (this.toMonth == "" || this.toDay == "" || this.toYr == "")
    ) {
      this.startDate = this.fromMonth + "/" + this.fromDay + "/" + this.fromYr;
      this.leaveService.getLeaveByDuration(isManager,teamId,this.startDate, "").subscribe(result => {
        this.leaves$ = result;
      }, err => {
        console.log(err);
        this.showToast(err);
      });
    }
    if ((this.toMonth != "" && this.toDay != "" && this.toYr != "") &&
      (this.fromMonth == "" || this.fromDay == "" || this.fromYr == "")
    ) {
      this.endDate = this.toMonth + "/" + this.toDay + "/" + this.toYr;
      let unixEndDt = formatDateUsingMoment(this.endDate, 'U');
      this.leaveService.getLeaveByDuration(isManager,teamId,"", this.endDate).subscribe(result => {
        this.leaves$ = _.filter(result, function (lv) {
          return lv.unixToDate <= unixEndDt;
        });
      }, err => {
        console.log(err);
        this.showToast(err);
      });
    }
    if ((this.toMonth != "" && this.toDay != "" && this.toYr != "") &&
      (this.fromMonth != "" || this.fromDay != "" || this.fromYr != "")
    ) {
      this.startDate = this.fromMonth + "/" + this.fromDay + "/" + this.fromYr;
      this.endDate = this.toMonth + "/" + this.toDay + "/" + this.toYr;
      let unixStartDt = formatDateUsingMoment(this.startDate, 'U');
      let unixEndDt = formatDateUsingMoment(this.endDate, 'U');
      this.leaveService.getLeaveByDuration(isManager,teamId,this.startDate, this.endDate).subscribe(result => {
        this.leaves$ = _.filter(result, function (lv) {
          return lv.unixFrDate >= unixStartDt && lv.unixToDate <= unixEndDt;
        });
      }, err => {
        console.log(err);
        this.showToast(err);
      });
    }
  }

  showToast(alert_message: string) {
    let toast = this.toastCtrl.create({
      message: alert_message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present(toast);
  }

}
