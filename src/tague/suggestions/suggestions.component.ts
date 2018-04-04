import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'tag-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss']
})
export class SuggestionsComponent {

  private _highlightIndex: number = 0;

  @Input() suggestions: string[];

  @Output() selected: EventEmitter<string> = new EventEmitter<string>();

  @Input() set highlightIndex(value: number) {
    const change = this._highlightIndex !== value;
    this._highlightIndex = value;
    if (change) {
      this.highlightIndexChange.emit(this._highlightIndex);
    }
  }

  get highlightIndex() {
    return this._highlightIndex;
  }

  @Output() highlightIndexChange: EventEmitter<number> = new EventEmitter<number>();

  constructor() {
  }


  itemSelected(item: string) {
    console.log(item);
    this.selected.emit(item);
  }
}
