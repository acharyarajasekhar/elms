import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewLeavePage } from './new-leave';
import {commonMethods} from '../../helper/common-methods';
@NgModule({
  declarations: [
    NewLeavePage,
  ],
  imports: [
    IonicPageModule.forChild(NewLeavePage),
  ],
  providers:[commonMethods]
})
export class NewLeavePageModule {}
