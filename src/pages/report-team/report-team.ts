import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Chart } from 'chart.js';

@IonicPage()
@Component({
  selector: 'page-report-team',
  templateUrl: 'report-team.html',
})
export class ReportTeamPage {
  @ViewChild('lineCanvas') lineCanvas;
  lineChart: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public _fireStore:AngularFirestore) {
  }

  

  groupByMonth(data:any[])
  {
        
    
        var res=data.reduce((total, item)=>{
	
        // Get No.of Days 'from' $ 'to'
        var noOfdays=[];
        for (var date= item.from; date<=item.to; date.setDate(date.getDate()+1)){
          noOfdays.push(new Date(date));
        }
        
        //Group No of Leaves Based on Month
        var monthData=noOfdays.reduce((monthTotal, dateItem)=>{
        var monthID=dateItem.getMonth();
        var year=dateItem.getFullYear();
        var key=monthID.toString()+'-'+year.toString();
          
        monthTotal[key]=monthTotal[key] || [];
        monthTotal[key].push(dateItem);
        return monthTotal;
        },{});
        
        var monthKey=Object.keys(monthData);
       
        for(var i=0;i<monthKey.length;i++){
          total[monthKey[i]]=total[monthKey[i]] || 0;
          total[monthKey[i]]=total[monthKey[i]]+monthData[monthKey[i]].length;
        }
        
        return total;
      
      },{});

      var months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

      var labels=Object.keys(res);

      var monthLabel=labels.map(t=>{
          var arrIndex=t.split('-');
          var index=arrIndex[0];
          var year=arrIndex[1];

          return months[index]+'-'+year;
          
      })

      var monthData=labels.map(y=>{
          return res[y];
      })

      var dataSet={};
      dataSet['label']=monthLabel;
      dataSet['data']=monthData;

      return dataSet;

  }


  ionViewDidLoad() {

    var leavesCollectionRef = this._fireStore.collection('eLeaves', 
             ref => ref
               .where("from", ">=", new Date())
               .orderBy("from", "asc")
           ).valueChanges();


           leavesCollectionRef.subscribe(arr=>{

            var data=this.groupByMonth(arr);



            this.lineChart = new Chart(this.lineCanvas.nativeElement, {
 
                type: 'line',
                data: {
                    labels: data['label'],
                    datasets: [
                        {
                            label: "Leave Count",
                            fill: false,
                            lineTension: 0.1,
                            backgroundColor: "rgba(75,192,192,0.4)",
                            borderColor: "rgba(75,192,192,1)",
                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: "rgba(75,192,192,1)",
                            pointBackgroundColor: "#fff",
                            pointBorderWidth: 1,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: "rgba(75,192,192,1)",
                            pointHoverBorderColor: "rgba(220,220,220,1)",
                            pointHoverBorderWidth: 2,
                            pointRadius: 1,
                            pointHitRadius: 10,
                            data: data['data'],
                            spanGaps: false,
                        }
                    ]
                }
          
            });
           })
           
  

  }

}
