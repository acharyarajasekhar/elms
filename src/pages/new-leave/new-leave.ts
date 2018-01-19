import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { LeaveServiceProvider } from '../../providers/leave-service/leave-service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MyLeavesPage } from "../my-leaves/my-leaves"

@IonicPage()
@Component({
  selector: 'page-new-leave',
  templateUrl: 'new-leave.html',
})
export class NewLeavePage {
  
  LeaveForm: FormGroup;
  myDate: Date = new Date();

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private formBuilder: FormBuilder,    
    public toastCtrl: ToastController,
    public leaveService: LeaveServiceProvider) {
      this.LeaveForm = this.formBuilder.group({
        isHalfDay: [false],
        from: [this.myDate, Validators.required],
        to: [this.myDate, Validators.required],
        reason: ['', Validators.required]
      });
  }
  
  addLeave(){
    this.leaveService.createLeave(this.LeaveForm.value);
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
