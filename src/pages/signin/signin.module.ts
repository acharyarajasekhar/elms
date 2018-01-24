import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SigninPage } from './signin';
import {commonMethods} from '../../helper/common-methods';

@NgModule({
  declarations: [
    SigninPage,
  ],
  imports: [
    IonicPageModule.forChild(SigninPage),
  ],
  providers:[commonMethods]
})
export class SigninPageModule {}
