import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ToastController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  forPwdForm: FormGroup;  

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private authService: AuthServiceProvider) {
    this.forPwdForm = this.formBuilder.group({
      userid: [null, ([Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-zA-Z]{2,4}$'),Validators.required])]      
    });
  }

  ionViewDidLoad() {    
  }

  navToSignin() {
    this.navCtrl.setRoot("SigninPage");
  }

  forgotPassword() {    
    this.authService.forgotPassword(this.forPwdForm.value).then(res=>{      
      this.navCtrl.setRoot("SigninPage");      
      this.authService.presentToast("Password reset email sent... Please check your inbox...");      
    },err=>{
      var errorCode = err.code;
      var errorMessage = err.message;      
      if(err.code == "auth/user-not-found")
        this.authService.presentToast("Email is not registered");
      else
        this.authService.presentToast(errorMessage);
    });
  }
}
