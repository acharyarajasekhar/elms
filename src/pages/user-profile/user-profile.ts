import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController } from 'ionic-angular';
import { FormGroup } from '@angular/forms';
import { User } from './../../models/user.model';
import { ImageProvider } from '../../providers/image-service/image-service';
import { storage } from 'firebase';

@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {

  profileForm: FormGroup;
  uid:string;
  user:any = {};
  userCtx:User;
  teamName:string;
  managerName:string;   

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl: ToastController,  
    private imageSrv: ImageProvider,
    private actionSheetCtrl: ActionSheetController) { 
      this.user = JSON.parse(localStorage.getItem('userContext'));
      this.teamName = (localStorage.getItem('teamName') != "" && localStorage.getItem('teamName') != null) ?localStorage.getItem('teamName'):"N.A";
      this.managerName = (localStorage.getItem('mgrName') != "" && localStorage.getItem('mgrName') != null)?localStorage.getItem('mgrName'):"N.A";
      this.uid = this.user.email;
  }

  ionViewDidLoad() {    
  }

  editProfile(){
    this.navCtrl.push("EditUserProfilePage",{user: this.user});
  }

  ngOnInit(){ 
  }

  showToast(alert_message:string){
    let toast = this.toastCtrl.create({
      message: alert_message,
      duration: 2000,
      position: 'bottom'
    }); 
    toast.present(toast);
  }  

 changePicture() {
    let actionSheet = this.actionSheetCtrl.create({
      enableBackdropDismiss: true,
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            let photoUrl = this.imageSrv.uploadFromCamera();
            alert(photoUrl);
          }
        }, {
          text: 'Gallery',
          icon: 'images',
          handler: () => {
            let photoUrl = this.imageSrv.uploadFromGallery();        
            alert(photoUrl);
          }
        }
      ]
    });
    actionSheet.present();
  }
}
