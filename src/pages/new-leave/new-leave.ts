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
  public PlanDate: string;
  public ToDate: string;
  public minDate: string;
  public maxDate: string;
  public sameDayleaves$: any[] = [];
  public leave: Leave;
  public lent: number;
  public Reasons:string;
  public HalfDay:boolean;
  public lType : string;
  public plnType:boolean;
  public frmplnlv : string;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public toastCtrl: ToastController,
    public leaveService: LeaveServiceProvider) {
      this.HalfDay=false;
      this.plnType=false;
      this.lType ="Un-Planned";
      this.FrmDate= new Date().toISOString();
      this.ToDate= new Date().toISOString();
      this.minDate= new Date().toISOString();
      this.PlanDate =  new Date(new Date(this.tmrdate).setHours(23, 59, 59, 0)).toISOString();
      console.log(this.PlanDate);
      this.maxDate= (moment(new Date()).add(3,'months')).toISOString();
      this.LeaveForm = this.formBuilder.group({
        isHalfDay: [false],
        from: [this.FrmDate, Validators.required],
        to: [this.ToDate, Validators.required],
        reason: ['',Validators.required],
        lvType :[this.lType],
      });
  }

  ionViewDidLoad() {

    this.leaveService.CreateNewleave().subscribe(lvCount => {

      if (lvCount === 0) {
        this.leaveService.createNewLeave(this.LeaveForm.value);
        this.plnType=false;
        this.LeaveForm.setValue({
          isHalfDay: false,
          from: new Date().toISOString(),
          to: new Date().toISOString(),
          reason: '',
          lvType : 'Un-Planned'
        });
        this.leaveService.subscribe.unsubscribe();
        this.showToast('Leave request created succesfully');
      }
      else if (lvCount > 0) {
        this.leaveService.subscribe.unsubscribe();
        this.showToast('You have already applied leaves on above From and To Date range');
      }
    })
  }
  addNewLeave() {
    console.log(this.LeaveForm.value);
    this.leave = this.LeaveForm.value;
    // let dd: Date = new Date(this.leave.from);
    // let frmdate: any = dd.getMonth() + 1 + "/" + dd.getDate() + "/" + dd.getFullYear();
    // let isManager = localStorage.getItem('isManagerRole');
    // let myTeam = localStorage.getItem('myTeam');
    // let myId = JSON.parse(localStorage.getItem('userContext')).email;
    // var toDTTMtdy = new Date(new Date(this.leave.to).setHours(23, 59, 59, 0));
    // this.leaveService.getExistingleavelist(isManager, myTeam, frmdate, myId, toDTTMtdy);
    this.leaveService.createNewLeave(this.leave);
  }

  showToast(alert_message: string) {
    let toast = this.toastCtrl.create({
      message: alert_message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present(toast);
  }

  getleavetype(){
    if(this.FrmDate <= this.PlanDate){    
      this.plnType=false;
      }
      else{
        this.plnType=true;
      }
      return this.plnType;
  }

  SetDate(){
    debugger;
    this.HalfDay =  this.LeaveForm.get(['isHalfDay']).value;
    this.Reasons =  this.LeaveForm.get(['reason']).value;
    this.frmplnlv =  this.LeaveForm.get(['lvType']).value;
    let plndlv = this.getleavetype();
    if(plndlv){
      this.lType = 'Planned';
    }
    else if(this.frmplnlv == 'Planned'){
      this.lType = 'Un-Planned';
    }
    else{
      this.lType = this.frmplnlv;
    }


     if(this.ToDate<this.FrmDate){
  
      this.ToDate=new Date(this.FrmDate).toISOString();
     

      this.LeaveForm.setValue({ 
        isHalfDay:  this.HalfDay,    
        from: this.FrmDate,
        to: this.ToDate,
        reason: this.Reasons,
        lvType : this.lType
      });
    }
    else{
      this.FrmDate = new Date(this.FrmDate).toISOString();
      this.ToDate = new Date(this.ToDate).toISOString();
     this.LeaveForm.setValue({ 
       isHalfDay:  this.HalfDay,    
       from: this.FrmDate,
       to: this.ToDate,
       reason: this.Reasons,
       lvType : this.lType
     });
    }
  }

  SetHalfDay(){   
      debugger;
    let plndlv = this.getleavetype();
    this.HalfDay =  this.LeaveForm.get(['isHalfDay']).value;
    this.Reasons =  this.LeaveForm.get(['reason']).value;
    this.frmplnlv =  this.LeaveForm.get(['lvType']).value;
    if(plndlv){
      this.lType = 'Planned';
    }
    else if(this.frmplnlv == 'Planned'){
      this.lType = 'Un-Planned';
    }
    else{
      this.lType = this.frmplnlv;
    }

    if(this.HalfDay && (this.ToDate != this.FrmDate)){
     this.ToDate=new Date(this.FrmDate).toISOString();
     this.LeaveForm.setValue({  
       isHalfDay:  this.HalfDay,     
       from: this.FrmDate,
       to: this.ToDate,
       reason: this.Reasons,
       lvType : this.lType
     });
   }
   else{
     this.FrmDate = new Date(this.FrmDate).toISOString();
     this.ToDate = new Date(this.ToDate).toISOString();
    this.LeaveForm.setValue({ 
      isHalfDay:  this.HalfDay,    
      from: this.FrmDate,
      to: this.ToDate,
      reason: this.Reasons,
      lvType : this.lType
    });
  }
 }

}
