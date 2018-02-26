import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import * as moment from 'moment';
import { LeaveServicev2Provider } from '../../providers/leave-servicev2/leave-servicev2';
import { leave } from '@angular/core/src/profile/wtf_impl';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { AppContextProvider } from '../../providers/app-context/app-context';
import { commonMethods } from '../../helper/common-methods';
@IonicPage()
@Component({
  selector: 'page-new-leave',
  templateUrl: 'new-leave.html',
})
export class NewLeavePage {

  leave: any;
  maxToDate = moment(new Date()).add(90, 'days').format('YYYY-MM-DD');
  minFromDate = moment(new Date()).add(0, 'days').format('YYYY-MM-DD');
  PlnFrmDate :any ;
  LveType:boolean = false;
  getMaxFromDate(toDate) {
    return moment(this.leave.to).format('YYYY-MM-DD');
  }

  getMinToDate(fromDate) {
    return moment(this.leave.from).format('YYYY-MM-DD');
  }

  createLeave() {
    this._Cmmethods.InitializeLoader();
    var sub = this.leaveSvc.createLeave(this.leave).subscribe(() => {
      sub.unsubscribe();    
      this.navCtrl.pop();
    })
    this._Cmmethods.loader.dismiss();
  }

  onDateChange() {
    if (new Date(this.leave.from) > new Date(this.leave.to)) {
      this.leave.to = this.leave.from;
    }

    if(new Date(moment(this.leave.from).format('YYYY-MM-DD'))>= new Date(moment(this.PlnFrmDate).add(2, 'days').format('YYYY-MM-DD'))){
      this.leave.lveType= "Planned";
      this.LveType = true;
    }
    else{
      if(this.leave.lveType== "Sick"){
        this.leave.lveType= "Sick";
      }  
      else{
        this.leave.lveType= "Un-Planned";
      }  
      this.LveType = false;
    }
  }

  onHlfDayChange(){
    this.leave.to = this.leave.from;
  }

  constructor(private leaveSvc: LeaveServicev2Provider,
    private appContext: AppContextProvider,
    private navCtrl: NavController,private _Cmmethods: commonMethods) {
     this.PlnFrmDate =new Date(new Date()).toISOString();
      this.leave = {
        from: new Date().toISOString(),
        to: new Date().toISOString(),
        isHalfDay: false,
        reason: "",
        status: 0,
        lveType: "Un-Planned"
      };
     }
}
