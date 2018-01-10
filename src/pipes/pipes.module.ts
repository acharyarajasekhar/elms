import { NgModule } from '@angular/core';
import { TrimTextPipe } from './trim-text/trim-text';
import { SummaryPipe } from '../helper/custom-pipe';
@NgModule({
	declarations: [
		TrimTextPipe,
		SummaryPipe
	],
	imports: [],
	exports: [
		TrimTextPipe,
		SummaryPipe
	]
})
export class PipesModule {}
