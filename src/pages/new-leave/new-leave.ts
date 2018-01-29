import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { LeaveServiceProvider } from '../../providers/leave-service/leave-service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-new-leave',
  templateUrl: 'new-leave.html',
})
export class NewLeavePage {
  
  LeaveForm: FormGroup;
  public FrmDate:string;
  public ToDate:string;
  public minDate : string;
  public maxDate : string;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private formBuilder: FormBuilder,    
    public toastCtrl: ToastController,
    public leaveService: LeaveServiceProvider) {
      this.FrmDate= new Date().toISOString();
      this.ToDate= new Date().toISOString();
      this.minDate= new Date().toISOString();
      this.maxDate= (moment(new Date()).add(3,'months')).toISOString();
      this.LeaveForm = this.formBuilder.group({
        isHalfDay: [false],
        from: [this.FrmDate, Validators.required],
        to: [this.ToDate, Validators.required],
        reason: ['',Validators.required]
      });
  }
  
  addLeave(){
    this.leaveService.createLeave(this.LeaveForm.value);
    this.navCtrl.pop();
    this.showToast('Leave request created succesfully');
  }

  addNewLeave()
  {
    this.leaveService.createNewLeave(this.LeaveForm.value);
    this.navCtrl.pop();
    this.showToast('Leave request created succesfully');
  }

  showToast(alert_message:string){
    let toast = this.toastCtrl.create({
      message: alert_message,
      duration: 2000,
      position: 'bottom'
    }); 
    toast.present(toast);
  }

}
