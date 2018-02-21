import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationsPage } from './notifications';
import { PipesModule } from '../../pipes/pipes.module';
import { TimeAgoPipeModule } from "time-ago-pipe/index";

@NgModule({
  declarations: [
    NotificationsPage
  ],
  imports: [
    IonicPageModule.forChild(NotificationsPage),
    PipesModule,
    TimeAgoPipeModule
  ],
  exports:[
  ]
})
export class NotificationsPageModule {
  constructor() {} 

}
