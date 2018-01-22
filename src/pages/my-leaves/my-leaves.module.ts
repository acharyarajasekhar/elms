import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyLeavesPage } from './my-leaves';

import { NgCalendarModule  } from '../../components/leave-calendar/calendar.module';

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
