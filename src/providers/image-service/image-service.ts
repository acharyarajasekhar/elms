import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { storage } from 'firebase';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { AppContextProvider } from '../app-context/app-context';
declare var window: any;

@Injectable()
export class ImageProvider {
  private basePath: string = '/avatarPicture';
  objectToSave: Array<any> = new Array;
  captureDataUrl: string;
  file: File;
  user:any = {};
  private takePictureOptions: CameraOptions = {
    quality: 50,   
    targetWidth: 600,
    targetHeight: 600,   
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation:true
  }

  private galleryOptions: CameraOptions = {
    quality: 50,   
    targetWidth: 600,
    targetHeight: 600,   
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,    
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    correctOrientation:true
  }

  constructor( 
    private camera: Camera,
    private appContext: AppContextProvider,
    private userService: UserServiceProvider) {
      this.user = this.appContext.myProfileObject;
  }
  //Take a picture and return a promise with the image data
 async uploadFromCamera() {  
    try{
      const result = await this.camera.getPicture(this.takePictureOptions);
      const image = `data:image/jpeg:base64,${result}`; 
      let uploadTask = await storage().ref().child('photos/' + this.user.email + '.jpg').put(this.dataURItoBlob(image));
      this.userService.updatePhotoUrl(this.user.email, uploadTask.downloadURL);      
      return uploadTask.downloadURL;
    }
    catch(e){
      console.error(e);
    }
  }

   //open the gallery and Return a promise with the image data
   async uploadFromGallery() {    
      try{
      const result = await this.camera.getPicture(this.galleryOptions);
      const image = `data:image/jpeg:base64,${result}`; 
      let uploadTask = await storage().ref().child('photos/' +this.user.email + '.jpg').put(this.dataURItoBlob(image));
      this.userService.updatePhotoUrl(this.user.email, uploadTask.downloadURL);
      return uploadTask.downloadURL;
      }
      catch(e){
        console.error(e);
      }
  }

  dataURItoBlob(dataURI) {    
    let binary = atob(dataURI.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
  };
}
