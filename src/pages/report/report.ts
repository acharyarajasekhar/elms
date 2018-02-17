import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ReportAnnualPage } from '../report-annual/report-annual';
import { ReportTeamPage } from '../report-team/report-team';
import { ReportReporteePage } from '../report-reportee/report-reportee';
import { LeaveServiceProvider } from '../../providers/leave-service/leave-service';
import { buildChartData } from '../../helper/date-formatter';
import { AppContextProvider } from '../../providers/app-context/app-context';
@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage implements OnInit{
  userContext = JSON.parse(localStorage.getItem('userContext'));
  tab1Root = ReportAnnualPage;
  tab2Root = ReportTeamPage;
  tab3Root = ReportReporteePage;
  user : any = {};
  userId:string;
  isManager :string;
  annualCount:number[]=[];
  constructor(public navCtrl: NavController, 
    private leaveService:LeaveServiceProvider,
    private appContext: AppContextProvider,
    public navParams: NavParams) {
      this.user =this.appContext.myProfileObject;
      this.userId = this.user.email;
      this.isManager = this.user.isManager;
  }

  ionViewDidLoad() {
  }

  async ngOnInit(){
    if(this.isManager == "true")
      await this.leaveService
                .getLeavesByUser(this.userId,true)
                .subscribe(result=>{
                  buildChartData(result);
      }); 
    else
      await this.leaveService
                .getLeavesByUser(this.userId,false)
                .subscribe(result=>{
                  buildChartData(result);
      });                                       
  }

}
