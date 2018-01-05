import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateLeaveRequestPage } from './create-leave-request';

@NgModule({
  declarations: [
    CreateLeaveRequestPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateLeaveRequestPage),
  ],
})
export class CreateLeaveRequestPageModule {}
