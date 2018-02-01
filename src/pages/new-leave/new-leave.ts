import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { LeaveServiceProvider } from '../../providers/leave-service/leave-service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { Leave } from '../../models/leave.model';

@IonicPage()
@Component({
  selector: 'page-new-leave',
  templateUrl: 'new-leave.html',
})
export class NewLeavePage {
  d: Date = new Date(new Date().setHours(0, 0, 0, 0));
  tdydate: any = this.d.getMonth() + 1 + "/" + this.d.getDate() + "/" + this.d.getFullYear();
  t: Date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  tmrdate: any = this.t.getMonth() + 1 + "/" + this.t.getDate() + "/" + this.t.getFullYear();
  LeaveForm: FormGroup;
  public FrmDate: string;
  public ToDate: string;
  public minDate: string;
  public maxDate: string;
  public sameDayleaves$: any[] = [];
  leave: Leave;
  lent: number;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public toastCtrl: ToastController,
    public leaveService: LeaveServiceProvider) {
    this.FrmDate = new Date().toISOString();
    this.ToDate = new Date().toISOString();
    this.minDate = new Date().toISOString();
    this.maxDate = (moment(new Date()).add(3, 'months')).toISOString();
    this.LeaveForm = this.formBuilder.group({
      isHalfDay: [false],
      from: [this.FrmDate, Validators.required],
      to: [this.ToDate, Validators.required],
      reason: ['', Validators.required]
    });
  }

  addNewLeave() {
    this.validateExistingLeave();
  }

  validateExistingLeave() {
    this.leave = this.LeaveForm.value;
    let dd: Date = new Date(this.leave.from);
    let frmdate: any = dd.getMonth() + 1 + "/" + dd.getDate() + "/" + dd.getFullYear();
    let isManager = localStorage.getItem('isManagerRole');
    let myTeam = localStorage.getItem('myTeam');
    let myId = JSON.parse(localStorage.getItem('userContext')).email;
    var toDTTMtdy = new Date(new Date(this.leave.to).setHours(23, 59, 59, 0));
    this.lent = 0;
    this.leaveService.getExistingleavelist(isManager, myTeam, frmdate, myId)
      .subscribe(leaves => {
        leaves.forEach((leaveItem: any) => {
          var leavesArray = leaveItem.payload.doc.data();
          leavesArray.leaveId = leaveItem.payload.doc.id;
          if (leavesArray.from <= toDTTMtdy && leavesArray.owner.id == myId && leavesArray.status <= 1) {
             this.lent = this.lent + 1;
          } 
        });
        if (this.lent === 0) {
          this.leaveService.createNewLeave(this.LeaveForm.value);
          this.navCtrl.pop();
          this.showToast('Leave request created succesfully');
        }
        else if (this.lent > 0) {
          this.navCtrl.pop();
          this.showToast('You have already applied leaves on above From and To Date range');
        }
      });
  }

  showToast(alert_message: string) {
    let toast = this.toastCtrl.create({
      message: alert_message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present(toast);
  }

}
