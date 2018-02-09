import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController } from 'ionic-angular';
import { FormGroup } from '@angular/forms';
import { User } from './../../models/user.model';
import { ImageProvider } from '../../providers/image-service/image-service';
import { AppContextProvider } from '../../providers/app-context/app-context';
import { Reference } from 'angularfire2/firestore';
@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {

  profileForm: FormGroup;;
  user:any = {};
 

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl: ToastController,  
    private imageSrv: ImageProvider,
    private appContext: AppContextProvider,
    private actionSheetCtrl: ActionSheetController) { 
      console.log(this.appContext.myProfileObject);
       this.user =this.appContext.myProfileObject;
  }

  editProfile(){
    this.navCtrl.push("EditUserProfilePage",{user: this.user});
  }

 changePicture() {
    let actionSheet = this.actionSheetCtrl.create({
      enableBackdropDismiss: true,
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.uploadFromCamera();
          }
        }, {
          text: 'Gallery',
          icon: 'images',
          handler: () => {
            this.uploadFromGallery();
          }
        }
      ]
    });
    actionSheet.present();
  }

  async uploadFromGallery() {
    this.user.photoUrl = await this.imageSrv.uploadFromGallery();    
  }

  async uploadFromCamera() {
    this.user.photoUrl = await this.imageSrv.uploadFromCamera();    
  }
}
