import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewLeavePage } from './new-leave';

@NgModule({
  declarations: [
    NewLeavePage,
  ],
  imports: [
    IonicPageModule.forChild(NewLeavePage),
  ],
})
export class NewLeavePageModule {}
