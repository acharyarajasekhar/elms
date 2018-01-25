import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from 'angularfire2/auth'
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AngularFirestore } from 'angularfire2/firestore';

declare var window: any;

@Injectable()
export class ImageProvider {
  private basePath: string = '/avatarPicture';
  objectToSave: Array<any> = new Array;
  captureDataUrl: string;

  private takePictureOptions: CameraOptions = {
    allowEdit: false,
    saveToPhotoAlbum: true,
    targetWidth: 720,
    targetHeight: 720,
    cameraDirection: this.camera.Direction.BACK,
    sourceType: this.camera.PictureSourceType.CAMERA,
    destinationType: this.camera.DestinationType.FILE_URI,
  }

  private galleryOptions: CameraOptions = {
    allowEdit: true,
    destinationType: this.camera.DestinationType.FILE_URI,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    targetWidth: 720,
    targetHeight: 720,
    correctOrientation: true
  }

  constructor(
    public afAuth: AngularFireAuth,    
    private camera: Camera) {

  }

  //Take a picture and return a promise with the image data
  uploadFromCamera() {
    /*this.camera.getPicture(this.takePictureOptions).then((imagePath) => {
      alert('got image path ' + imagePath);
      return this.makeFileIntoBlob(imagePath);//convert picture to blob
    }).then((imageBlob) => {
      alert('got image blob ' + imageBlob);
      return this.uploadToFirebase(imageBlob);//upload the blob
    }).then((uploadSnapshot: any) => {
      alert('file uploaded successfully  ' + uploadSnapshot.downloadURL);
      return this.saveToDatabase(uploadSnapshot);//store reference to storage in database
    }).then((_uploadSnapshot: any) => {
      alert('file saved to asset catalog successfully  ');
    }, (_error) => {
      alert('Error ' + (_error.message || _error));
    });*/
    this.camera.getPicture(this.takePictureOptions).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.captureDataUrl = 'data:image/jpeg;base64,' + imageData;      
      let storageRef = firebase.storage().ref();      
      // Create a timestamp as filename
      const filename = Math.floor(Date.now() / 1000);
  
      // Create a reference to 'images/todays-date.jpg'
      const imageRef = storageRef.child(`photos/${filename}.jpg`);
  
      imageRef.putString(this.captureDataUrl, firebase.storage.StringFormat.DATA_URL).then((snapshot)=> {
       alert("photo uploaded" + snapshot.downloadURL);
      });
    }, (err) => {
      // Handle error
      alert(err);
    });
  }

  //open the gallery and Return a promise with the image data
  uploadFromGallery() {
    /*this.camera.getPicture(this.galleryOptions).then((imagePath) => {
      alert('got image path ' + imagePath);
      return this.makeFileIntoBlob(imagePath);//convert picture to blob
    }).then((imageBlob) => {
      alert('got image blob ' + imageBlob);
      return this.uploadToFirebase(imageBlob);//upload the blob
    }).then((uploadSnapshot: any) => {
      alert('file uploaded successfully  ' + uploadSnapshot.downloadURL);
      return this.saveToDatabase(uploadSnapshot);//store reference to storage in database
    }).then((_uploadSnapshot: any) => {
      alert('file saved to asset catalog successfully  ');
    }, (_error) => {
      alert('Error ' + (_error.message || _error));
    });*/
    this.camera.getPicture(this.galleryOptions).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      alert(imageData);
      this.captureDataUrl = 'data:image/jpeg;base64,' + imageData;
      alert(this.captureDataUrl);
      let storageRef = firebase.storage().ref();
      alert(storageRef);
      // Create a timestamp as filename
      const filename = Math.floor(Date.now() / 1000);
  
      // Create a reference to 'images/todays-date.jpg'
      const imageRef = storageRef.child(`photos/${filename}.jpg`);
  
      imageRef.putString(this.captureDataUrl, firebase.storage.StringFormat.DATA_URL).then((snapshot)=> {
       alert("photo uploaded" + snapshot.downloadURL);
      });
    }, (err) => {
      alert(err);
    });
  }

  makeFileIntoBlob(_imagePath) {
    return new Promise((resolve, reject) => {
      window.resolveLocalFileSystemURL(_imagePath, (fileEntry) => {

        fileEntry.file((resFile) => {

          var reader = new FileReader();
          reader.onloadend = (evt: any) => {
            var imgBlob: any = new Blob([evt.target.result], { type: 'image/jpeg' });
            imgBlob.name = 'sample.jpg';
            resolve(imgBlob);
          };

          reader.onerror = (e) => {
            console.log('Failed file read: ' + e.toString());
            reject(e);
          };

          reader.readAsArrayBuffer(resFile);
        });
      });
    });
  }

  //Upload picture to the firebase storage
  uploadToFirebase(imgBlob: any) {
    var randomNumber = Math.floor(Math.random() * 256);
    console.log('Random number : ' + randomNumber);
    return new Promise((resolve, reject) => {
      let storageRef = firebase.storage().ref(this.basePath + randomNumber + '.jpg');//Firebase storage main path

      let metadata: firebase.storage.UploadMetadata = {
        contentType: 'image/jpeg',
      };

      let uploadTask = storageRef.put(imgBlob, metadata);
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          // upload in progress
          //let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          //console.log(progress);
        },
        (error) => {
          // upload failed
          console.log(error);
          reject(error);
        },
        () => {
          // upload success
          let url = uploadTask.snapshot.downloadURL
          console.log('Saved picture url', url);
          resolve(uploadTask.snapshot);
        });
    });
  }

  saveToDatabase(uploadSnapshot) {
    var ref = firebase.database().ref('photos');

    return new Promise((resolve, reject) => {

      // we will save meta data of image in database
      var dataToSave = {
        'URL': uploadSnapshot.downloadURL, // url to access file
        'name': uploadSnapshot.metadata.name, // name of the file
        'lastUpdated': new Date().getTime(),
      };

      ref.push(dataToSave, (response) => {
        resolve(response);
      });
    });
  }


}
