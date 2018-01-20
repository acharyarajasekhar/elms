import * as moment from 'moment';

function calculateDays(startDate,endDate){
    var ONE_DAY = 1000 * 60 * 60 * 24
    var start_ms = moment(startDate,'MM/DD/YYYY').milliseconds();
    var end_ms = moment(endDate,'MM/DD/YYYY').milliseconds();
    var difference_ms = Math.abs(end_ms - start_ms)
    return Math.round(difference_ms/ONE_DAY)
}

function buildChartData(result:any[]){
  let annualData:any[]= [];
   if(result.length > 0){
     result.forEach(lv=>{
        let days= this.calculateDays(lv.data.from,lv.data.to);
        annualData.push(days);
     });
   }
}

function searchLeaveBYDateRange(startDate,endate){
  
}

export {calculateDays,buildChartData}