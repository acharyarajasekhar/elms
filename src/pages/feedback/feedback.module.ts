import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedbackPage } from './feedback';
import {commonMethods} from '../../helper/common-methods';

@NgModule({
  declarations: [
    FeedbackPage,
  ],
  imports: [
    IonicPageModule.forChild(FeedbackPage),
  ],
  providers:[commonMethods]
})
export class FeedbackPageModule {}
