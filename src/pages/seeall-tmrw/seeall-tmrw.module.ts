import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SeeAllTmrwPage } from './seeall-tmrw';
import { PipesModule } from '../../pipes/pipes.module';
import {commonMethods} from '../../helper/common-methods';

@NgModule({
  declarations: [
    SeeAllTmrwPage
  ],
  imports: [
    IonicPageModule.forChild(SeeAllTmrwPage),
    PipesModule,
  ],
  exports:[
  ],
  providers:[commonMethods]
})
export class SeeAllTmrwPageModule {}
