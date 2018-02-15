import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from '../../pipes/pipes.module';
import { DetailsviewPage } from './detailsview';


@NgModule({
  declarations: [
    DetailsviewPage
  ],
  imports: [
    IonicPageModule.forChild(DetailsviewPage),
    PipesModule,
  ],
  exports:[
  ]
})
export class DetailsviewPageModule {}
