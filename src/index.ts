import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagueComponent } from "./tague/tague.component";
import { SuggestionsComponent } from "./tague/suggestions/suggestions.component";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TagueComponent, SuggestionsComponent],
  exports: [
    TagueComponent
  ]
})
export class TagueModule {
}
