import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyLeavesPage } from './my-leaves';

@NgModule({
  declarations: [
    MyLeavesPage,
  ],
  imports: [
    IonicPageModule.forChild(MyLeavesPage),
  ],
})
export class MyLeavesPageModule {}
