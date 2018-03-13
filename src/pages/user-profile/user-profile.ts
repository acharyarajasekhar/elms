import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController } from 'ionic-angular';
import { FormGroup } from '@angular/forms';
import { User } from './../../models/user.model';
import { ImageProvider } from '../../providers/image-service/image-service';
import { AppContextProvider } from '../../providers/app-context/app-context';
import { Reference } from 'angularfire2/firestore';
import { ImageViewerController } from 'ionic-img-viewer';
@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {

  profileForm: FormGroup;;
  user:any = {};
  _imageViewerCtrl: ImageViewerController;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl: ToastController,  
    private imageSrv: ImageProvider,
    private appContext: AppContextProvider,
    imageViewerCtrl: ImageViewerController,
    private actionSheetCtrl: ActionSheetController) { 
      // this.user =this.appContext.myProfileObject;
      this._imageViewerCtrl = imageViewerCtrl;
  }

  editProfile(){
    this.navCtrl.push("EditUserProfilePage",{user: this.user});
  }
  
  presentImage(myImage) {
    const imageViewer = this._imageViewerCtrl.create(myImage);
    imageViewer.present();
   // setTimeout(() => imageViewer.dismiss(), 3000);
    imageViewer.onDidDismiss(() => {});
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
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
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

  ionViewWillEnter() {
    this.user =this.appContext.myProfileObject;
  }
}
