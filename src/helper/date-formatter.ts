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
        let days= calculateDays(lv.data.from,lv.data.to);
        annualData.push(days);
     });
   }
}

function formatDateUsingMoment(dateVal,formatSig:string){
  let result;
  switch(formatSig){
    case 'L':
      result = moment(dateVal).format("L");//09/04/1986
      break;
    case 'LL':
      result = moment(dateVal).format("LL");//September 4, 1986
      break;  
    case 'll':
      result = moment(dateVal).format("ll");//Sep 4, 1986
      break;   
    case 'MM/DD/YYYY':
      result = moment(dateVal).format("MM/DD/YYYY");//09/04/1986
      break;  
    case 'X':
      result = moment(dateVal).format("X");//Unix format ~3212312
      break;  
    case 'U':
      result = moment(dateVal).unix();//Unix format ~3212312
      break;
  }

  return result;
}

function diffOfDaysOfDateRange(startdDate,endDate){
  let startDtObject = moment(startdDate).toObject();
  let endDtObject = moment(endDate).toObject();

  let endArr = moment([endDtObject.years, endDtObject.months, endDtObject.date]);
  let startArr = moment([startDtObject.years, startDtObject.months, startDtObject.date]);
  return endArr.diff(startArr, 'days')
}

export {calculateDays,buildChartData, formatDateUsingMoment ,diffOfDaysOfDateRange}