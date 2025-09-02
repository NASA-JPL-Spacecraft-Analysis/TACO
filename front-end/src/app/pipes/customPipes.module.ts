import { NgModule } from '@angular/core';
import { LengthPipe } from './length.pipe';
import { InsertLinkTagsPipe } from './insertLinkTags.pipe';

@NgModule({
  declarations: [
    LengthPipe,
    InsertLinkTagsPipe
  ],
  exports: [
    LengthPipe,
    InsertLinkTagsPipe
  ]
})
export class CustomPipesModule {}
