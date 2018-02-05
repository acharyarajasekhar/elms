import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { searchservice } from '../../providers/search-service/search-service';

@IonicPage()
@Component({
  selector: 'page-detailsview',
  templateUrl: 'detailsview.html',
})
export class DetailsviewPage {

  name = this.navParams.get('name');
  from = this.navParams.get('from');
  to = this.navParams.get('to');
  status = this.navParams.get('status');
  reason = this.navParams.get('reason');
  photoUrl = this.navParams.get('photoUrl');
  TeamID=this.navParams.get('teamId');
  ManagerID=this.navParams.get('ManagerEmail');
  leavesCollections:any;
 


  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl: ToastController,
    private leaveService:searchservice,
    public viewCtrl: ViewController) {
      this.getOverlappedLeaves(this.from,this.to);
      this.leaveService.getLeaveItemsCollections()
      .subscribe(Leaves=>{
      this.leavesCollections =Leaves;
      //this._cmnMethods.loader.dismiss();
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailsviewPage');
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }


   getOverlappedLeaves(frDate,toDate) {
    if (frDate != "" && toDate !="") {
       this.leaveService.getLeaveItem(true,this.ManagerID,frDate,toDate)
    }
  }


  showToast(alert_message: string) {
    let toast = this.toastCtrl.create({
      message: alert_message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present(toast);
  }

  getColor(status) {
    switch (status) {
      case 0:
        return 'gray';
      case 1:
        return 'green';
      case 2:
        return 'red';
      default:
        return 'orange';
    }
  }
}
