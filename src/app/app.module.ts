import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { MyLeavesPage } from '../pages/my-leaves/my-leaves';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';

// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { UserServiceProvider } from '../providers/user-service/user-service';
import { LeaveServiceProvider } from '../providers/leave-service/leave-service';
import { AppErrorHandlerProvider } from '../providers/app-error-handler/app-error-handler';
import { NotificationService } from '../providers/notification-service/notification-service';
import {serachservice} from '../providers/search-service/search-service';
import { ReportTeamPage } from '../pages/report-team/report-team';
import { ReportAnnualPage } from '../pages/report-annual/report-annual';
import { ReportReporteePage } from '../pages/report-reportee/report-reportee';
import { TeamServiceProvider } from '../providers/team-service/team-service';
import { DetailsviewPage } from '../pages/detailsview/detailsview';

import { FirebaseConfig } from '../app/firebase.config';
import { IonicProConfig } from '../app/ionic.pro.config';
import { Camera } from '@ionic-native/camera';
import { ImageProvider } from '../providers/image-service/image-service';
  
@NgModule({
  declarations: [
    MyApp,
    ReportTeamPage,
    ReportAnnualPage,
    ReportReporteePage,
    DetailsviewPage
  ],
  imports: [    
    BrowserModule,
    HttpModule,
   // BrowserAnimationsModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FirebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ReportTeamPage,
    ReportAnnualPage,
    ReportReporteePage,
    DetailsviewPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,    
    AuthServiceProvider,
    UserServiceProvider,
    LeaveServiceProvider,
    NotificationService,
    TeamServiceProvider,
    serachservice,
    IonicErrorHandler,
    [{provide: ErrorHandler, useClass: AppErrorHandlerProvider}],
    Camera,
    ImageProvider,
  ]
})
export class AppModule {}
