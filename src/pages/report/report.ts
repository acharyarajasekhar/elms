import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ReportAnnualPage } from '../report-annual/report-annual';
import { ReportTeamPage } from '../report-team/report-team';
import { ReportReporteePage } from '../report-reportee/report-reportee';
import { LeaveServiceProvider } from '../../providers/leave-service/leave-service';
import * as moment from 'moment';

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
                  this.buildChartDAta(result);
      }); 
    else
      await this.leaveService
                .getLeavesByUser(this.uid,false)
                .subscribe(result=>{
                  this.buildChartDAta(result);
      });                                       
  }

  calculateDays(startDate,endDate){
      var ONE_DAY = 1000 * 60 * 60 * 24
      var start_ms = moment(startDate,'MM/DD/YYYY').milliseconds();
      var end_ms = moment(endDate,'MM/DD/YYYY').milliseconds();
      var difference_ms = Math.abs(end_ms - start_ms)
      return Math.round(difference_ms/ONE_DAY)
  }

  buildChartDAta(result:any[]){
    let annualData:any[]= [];
     if(result.length > 0){
       result.forEach(lv=>{
          let days= this.calculateDays(lv.data.from,lv.data.to);
          annualData.push(days);
       });
     }
  }

}
