import { NgModule } from '@angular/core';
import { TrimTextPipe } from './trim-text/trim-text';
import { SummaryPipe } from '../helper/custom-pipe';
import { NamePipe } from '../helper/name-pipe';
@NgModule({
	declarations: [
		TrimTextPipe,
		SummaryPipe,
		NamePipe
	],
	imports: [],
	exports: [
		TrimTextPipe,
		SummaryPipe,
		NamePipe
	]
})
export class PipesModule {}
