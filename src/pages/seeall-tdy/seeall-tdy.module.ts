import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SeeAllTdyPage } from './seeall-tdy';
import { PipesModule } from '../../pipes/pipes.module';
import {commonMethods} from '../../helper/common-methods';

@NgModule({
  declarations: [
    SeeAllTdyPage
  ],
  imports: [
    IonicPageModule.forChild(SeeAllTdyPage),
    PipesModule,
  ],
  exports:[
  ],
  providers:[commonMethods]
})
export class SeeAllTdyPageModule {}
