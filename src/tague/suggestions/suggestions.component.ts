import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ItemType } from "../tague.component";


export interface Suggestion {
  displayText: string;
  disabled: boolean;
  item: ItemType;
}

@Component({
  selector: 'tag-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss']
})
export class SuggestionsComponent {

  private _highlightIndex: number = 0;

  @Input() suggestions: Suggestion[] = null;
  @Input() noItemsMessage: string;

  @Output() selected: EventEmitter<ItemType> = new EventEmitter<ItemType>();

  @Input() set highlightIndex(value: number) {
    const change = this._highlightIndex !== value;
    this._highlightIndex = value;
    if (change) {
      this.highlightIndexChange.emit(this._highlightIndex);
    }
  }

  @Input()
  @HostBinding('style.background-color')
  backgroundColor: string = '#fff';

  get highlightIndex() {
    return this._highlightIndex;
  }

  @Output() highlightIndexChange: EventEmitter<number> = new EventEmitter<number>();

  constructor() {
  }


  itemSelected(item: ItemType) {
    this.selected.emit(item);
  }
}
