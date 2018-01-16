import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';

@IonicPage()
@Component({
  selector: 'page-report-reportee',
  templateUrl: 'report-reportee.html',
})
export class ReportReporteePage {

  @ViewChild('doughnutCanvas') doughnutCanvas;
  doughnutChart: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
 
      type: 'doughnut',
      data: {
          labels: ["EL", "CL", "Others"],
          datasets: [{
              label: 'Leave Count',
              data: [12, 19, 3],
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                // "#FFCE56",
                // "#FF6384",
                // "#36A2EB",
                "#FFCE56"
              ],
              hoverBackgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                // 'rgba(255, 206, 86, 0.2)',
                // 'rgba(75, 192, 192, 0.2)',
                // 'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.5)'
              ]
          }]
      }

  });
  }

}
