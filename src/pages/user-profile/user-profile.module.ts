import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserProfilePage } from './user-profile';
import { AvatarDirective } from '../../components/avatar/avatar';

@NgModule({
  declarations: [
    AvatarDirective,
    UserProfilePage,    
  ],
  imports: [
    IonicPageModule.forChild(UserProfilePage),
  ],
})
export class UserProfilePageModule {}
