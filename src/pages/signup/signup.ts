import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  signUpForm: FormGroup;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private formBuilder: FormBuilder,
    public authService: AuthServiceProvider) {
    this.signUpForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  navToSignin() {
    this.navCtrl.setRoot("SigninPage");
  }

  signUp() {
    this.authService.signUp(this.signUpForm.value).then((data) => {
      if(data) {
        // this.navCtrl.setRoot("HomePage");
      }
    })
  }

  

}
