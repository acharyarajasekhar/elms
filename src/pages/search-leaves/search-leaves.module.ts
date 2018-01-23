import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchLeavesPage } from './search-leaves';
import { PipesModule } from '../../pipes/pipes.module';
import {commonMethods} from '../../helper/common-methods'

@NgModule({
  declarations: [
    SearchLeavesPage
  ],
  imports: [
    IonicPageModule.forChild(SearchLeavesPage),
    PipesModule,
  ],
  exports:[
  ],
  providers:[commonMethods]
})
export class SearchLeavesPageModule {}
