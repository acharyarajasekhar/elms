import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { storage } from 'firebase';

declare var window: any;

@Injectable()
export class ImageProvider {
  private basePath: string = '/avatarPicture';
  objectToSave: Array<any> = new Array;
  captureDataUrl: string;
  file: File;

  private takePictureOptions: CameraOptions = {
    quality: 50,   
    targetWidth: 600,
    targetHeight: 600,   
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }

  private galleryOptions: CameraOptions = {
    quality: 50,   
    targetWidth: 600,
    targetHeight: 600,   
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,    
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY    
  }

  constructor( 
    private camera: Camera) {
  }

  //Take a picture and return a promise with the image data
 async uploadFromCamera() {  
    try{
      const result = await this.camera.getPicture(this.takePictureOptions);
      const image = `data:image/jpeg:base64,${result}`;      
      storage().ref().child('photos/' + localStorage.getItem('myId') + '.jpg').put(this.dataURItoBlob(image));
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
      storage().ref().child('photos/' + localStorage.getItem('myId') + '.jpg').put(this.dataURItoBlob(image));
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
