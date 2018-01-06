import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyLeavesPage } from './my-leaves';

import { NgCalendarModule  } from 'ionic2-calendar';

@NgModule({
  declarations: [
    MyLeavesPage,
  ],
  imports: [
    NgCalendarModule,
    IonicPageModule.forChild(MyLeavesPage),
  ],
})
export class MyLeavesPageModule {}
