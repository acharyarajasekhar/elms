import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ReportAnnualPage } from '../report-annual/report-annual';
import { ReportTeamPage } from '../report-team/report-team';
import { ReportReporteePage } from '../report-reportee/report-reportee';
import { LeaveServiceProvider } from '../../providers/leave-service/leave-service';
import { buildChartData } from '../../helper/date-formatter';

@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage implements OnInit{
  uid:string = localStorage.getItem('myId');;
  tab1Root = ReportAnnualPage;
  tab2Root = ReportTeamPage;
  tab3Root = ReportReporteePage;
  annualCount:number[]=[];
  constructor(public navCtrl: NavController, 
    private leaveService:LeaveServiceProvider,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  async ngOnInit(){
    if(localStorage.getItem('isManagerRole') == "true")
      await this.leaveService
                .getLeavesByUser(this.uid,true)
                .subscribe(result=>{
                  buildChartData(result);
      }); 
    else
      await this.leaveService
                .getLeavesByUser(this.uid,false)
                .subscribe(result=>{
                  buildChartData(result);
      });                                       
  }

}
