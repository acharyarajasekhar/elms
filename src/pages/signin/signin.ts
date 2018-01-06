import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {

  signInForm: FormGroup;  

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private formBuilder: FormBuilder,
    private authService: AuthServiceProvider) {
    this.signInForm = this.formBuilder.group({
      userid: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SigninPage');
  }

  navToSignup() {
    this.navCtrl.push('SignupPage');
  }

  signIn() {
    this.authService.signIn(this.signInForm.value).then((user) => {
      if(this.authService.user) {
        this.navCtrl.setRoot("HomePage");
      }
    })
  }

}
