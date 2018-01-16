import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';

@IonicPage()
@Component({
  selector: 'page-report-annual',
  templateUrl: 'report-annual.html',
})
export class ReportAnnualPage {
 
  @ViewChild('barCanvas') barCanvas;
  barChart: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.barChart = new Chart(this.barCanvas.nativeElement, {
 
      type: 'bar',
      data: {
          labels: ["Jan", "Feb", "March", "April", "May", "Jun", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
          datasets: [{
              label: 'Leave Count',
              data: [12, 19, 3, 5, 2, 3, 11, 23, 15, 12, 11, 13],
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(169, 159, 64, 0.2)',
                  'rgba(235, 99, 132, 0.2)',
                  'rgba(209, 162, 235, 0.2)',
                  'rgba(215, 206, 86, 0.2)',
                  'rgba(85, 192, 192, 0.2)',
                  'rgba(53, 102, 255, 0.2)',
                  'rgba(55, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(169, 159, 64, 1)',
                  'rgba(235, 99, 132, 1)',
                  'rgba(209, 162, 235, 1)',
                  'rgba(215, 206, 86, 1)',
                  'rgba(85, 192, 192, 1)',
                  'rgba(53, 102, 255, 1)',
                  'rgba(55, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
      }

  });
  }

}
