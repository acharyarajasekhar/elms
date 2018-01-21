import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchLeavesPage } from './search-leaves';
//import { TimeAgoPipe } from 'time-ago-pipe';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    SearchLeavesPage,
    //TimeAgoPipe
  ],
  imports: [
    IonicPageModule.forChild(SearchLeavesPage),
    PipesModule,
  ],
  exports:[
    //TimeAgoPipe
  ]
})
export class SearchLeavesPageModule {}
