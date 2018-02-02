import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';


@Component({
  templateUrl: 'app.html',
  styles:[`
  
  @-webkit-keyframes animate {
      from  {background-position: 0 0 }
      to  {background-position: 100% 0  }

      }


  @keyframes animate {
      from  {background-position: 0 0 }
      to  {background-position: 100% 0  }

      }

  .UserHeader
  {
    height: 150px;
    min-width: 100%;
    min-height: 100%;
    background-image: url('../../assets/imgs/bg1.png') !important;
    animation:animate 45s infinite;
    background-color: #039be5 !important;
  }
  `]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = "SigninPage";
  Userdetails:any;
  photoURL:any;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public authService: AuthServiceProvider) {
    this.initializeApp();
//debugger;
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: "HomePage" },
      { title: 'Profile', component: "UserProfilePage" },
      { title: 'Leaves', component: "MyLeavesPage" },
      { title: 'Reports', component: "ReportPage" },
      { title: 'Feedback', component: "FeedbackPage" }
    ];

    this.Userdetails =localStorage.getItem('userContext') ? JSON.parse(localStorage.getItem('userContext')) : null;
    this.photoURL=this.Userdetails ? this.Userdetails.photoUrl : "../assets/imgs/user.png";
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    // this.nav.setRoot(page.component);
    if (page.component == "HomePage") {
      this.nav.setRoot(page.component);
    }
    else {
      this.nav.push(page.component);
    }
  }

  signOut(){
    this.authService.signOut();
    this.nav.setRoot("SigninPage");
  }
}
