import { NgModule } from '@angular/core';
import { TrimTextPipe } from './trim-text/trim-text';
import { SummaryPipe } from '../helper/custom-pipe';
import { NamePipe } from '../helper/name-pipe';
import { NametrimPipe } from './../helper/name-trim';
import { FilterByEmailIdPipe } from './filter-by-email-id/filter-by-email-id';
import { FilterByIsManagerFlagPipe } from './filter-by-is-manager-flag/filter-by-is-manager-flag';
import { FilterNotificationPipe } from './filter-notification/filter-notification';
import {filterBySearchPipe} from './filter-by-search/filter-by-search';
@NgModule({
	declarations: [
		TrimTextPipe,
		SummaryPipe,
		NamePipe,
		NametrimPipe,
		FilterByEmailIdPipe,
		FilterByIsManagerFlagPipe,
		FilterNotificationPipe,
		filterBySearchPipe
	],
	imports: [],
	exports: [
		TrimTextPipe,
		SummaryPipe,
		NamePipe,
		NametrimPipe,
		FilterByEmailIdPipe,
		FilterByIsManagerFlagPipe,
		FilterNotificationPipe,
		filterBySearchPipe
	]
})
export class PipesModule {}
