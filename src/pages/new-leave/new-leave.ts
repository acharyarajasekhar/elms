import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LeaveServiceProvider, Leave } from '../../providers/leave-service/leave-service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
@IonicPage()
@Component({
  selector: 'page-new-leave',
  templateUrl: 'new-leave.html',
})
export class NewLeavePage {
  LeaveForm: FormGroup;
  public isHalfDay: boolean;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public leaveService: LeaveServiceProvider) {

      this.LeaveForm = this.formBuilder.group({
        isHalfDay: [''],
        from: ['', Validators.required],
        to: ['', Validators.required],
        reason: ['', Validators.required],
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewLeavePage');
  }
  addLeave(){
    console.log(this.LeaveForm.value);
    debugger;
    this.leaveService.createLeave(this.LeaveForm.value);

  }

}
