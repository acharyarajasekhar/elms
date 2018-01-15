import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ReportAnnualPage } from '../report-annual/report-annual';
import { ReportTeamPage } from '../report-team/report-team';
import { ReportReporteePage } from '../report-reportee/report-reportee';

@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage {
  userCtx:any;
  tab1Root = ReportAnnualPage;
  tab2Root = ReportTeamPage;
  tab3Root = ReportReporteePage;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.userCtx = this.navParams.get('userCtx');
  }

}
