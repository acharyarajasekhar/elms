import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchLeavesPage } from './search-leaves';

@NgModule({
  declarations: [
    SearchLeavesPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchLeavesPage),
  ],
})
export class SearchLeavesPageModule {}
