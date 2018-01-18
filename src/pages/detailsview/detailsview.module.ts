import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailsviewPage } from './detailsview';

@NgModule({
  declarations: [
    DetailsviewPage,
  ],
  imports: [
    IonicPageModule.forChild(DetailsviewPage),
  ],
})
export class DetailsviewPageModule {}
