import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  public isHalfDay: boolean;
  public today: string;
  public today1: string;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public leaveService: LeaveServiceProvider) {
      this.today = new Date().toISOString(),
      this.today1 = new Date().toISOString(),
      this.LeaveForm = this.formBuilder.group({
        isHalfDay: [false],
        from: ['', Validators.required],
        to: ['', Validators.required],
        reason: ['', Validators.required]
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewLeavePage');
  }
  addLeave(){
    this.leaveService.createLeave(this.LeaveForm.value);
    this.navCtrl.push("MyLeavesPage");
  }

}
