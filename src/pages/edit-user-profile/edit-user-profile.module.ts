import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditUserProfilePage } from './edit-user-profile';

@NgModule({
  declarations: [
    EditUserProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(EditUserProfilePage),
  ],
})
export class EditUserProfilePageModule {}
