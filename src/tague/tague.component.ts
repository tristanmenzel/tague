import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Suggestion } from './suggestions/suggestions.component';


export declare type ItemSourceDelegate = (query: string) => string[];
export declare type AsyncItemSourceDelegate = (query: string) => Promise<string[]>;

export declare type ItemSource = ItemSourceDelegate | AsyncItemSourceDelegate | string[];

export declare type ItemType = string | { [key: string]: string };


const KEYS = {
  UP: 38,
  DOWN: 40,
  ENTER: 13,
  TAB: 9,
  BACKSPACE: 8,
  ESC: 27
};

@Component({
  selector: 'tag-tague',
  templateUrl: './tague.component.html',
  styleUrls: ['./tague.component.scss']
})
export class TagueComponent {

  private _selectedItems: ItemType[] = [];

  public querySubject: BehaviorSubject<string> = new BehaviorSubject(null);

  public suggestions: Suggestion[] = null;

  public highlightIndex = 0;

  public queryText: string = null;

  private showSuggestions: boolean = false;

  @Input() public placeholder: string = '';

  @Input('inputId') id: string = 'tague-component';
  @Input() noItemsMessage: string = 'No matches';

  @Input() displayProp: string = null;
  @Input() disabledProp: string = 'disabled';

  @Input()
  @HostBinding('style.background-color')
  backgroundColor: string = '#fff';

  @Input() label: string;

  @Input() set itemSource(value: ItemSource) {
    if (!value) {
      return;
    }
    if (value instanceof Array) {
      this.itemSourceAsAsync = (query: string) => {
        return Promise.resolve(query === null ? null : value
          .filter(x => this.getDisplayText(x).toUpperCase().startsWith(query.toUpperCase())));
      };
    } else {
      this.itemSourceAsAsync = (query: string) => {
        if (query === null) {
          return Promise.resolve(null);
        }
        const res = value(query);
        return res instanceof Promise ? res : Promise.resolve(res);
      };
    }
  }

  @Input() set selectedItems(value: ItemType[]) {
    this._selectedItems = [...value];
  }

  @Output() selectedItemsChange: EventEmitter<ItemType[]> = new EventEmitter<ItemType[]>();


  @Input() equalityComparer = (a: ItemType, b: ItemType): boolean => {
    if (typeof a === 'string' || typeof b === 'string') {
      return a === b;
    } else {
      return Object.keys(a)
        .every(k => a[k] === b[k]);
    }
  };

  get dynamicPlaceholder() {
    return this.selectedItems.length ? '' : this.placeholder;
  }

  get selectedItems(): ItemType[] {
    return this._selectedItems;
  }

  getDisplayText = (item: ItemType): string => {
    if (typeof item === 'string') {
      return item;
    } else if (item.hasOwnProperty(this.displayProp)) {
      return item[this.displayProp];
    }
    return null;
  };


  getDisabledProp = (item: ItemType): boolean => {
    if (typeof item === 'string') {
      return false;
    } else if (item.hasOwnProperty(this.disabledProp)) {
      return !!item[this.disabledProp];
    } else {
      return false;
    }
  };


  constructor() {
    this.querySubject
      .asObservable()
      .do(val => this.showSuggestions = val !== null)
      .switchMap(val => Observable.fromPromise(this.itemSourceAsAsync(val)))
      .map(suggestions => suggestions && suggestions
        .filter(sug => !this.selectedItems
          .some(selected => this.equalityComparer(sug, selected))))
      .subscribe(suggestions => {
        this.suggestions = suggestions && suggestions.map(s => ({
          displayText: this.getDisplayText(s),
          disabled: this.getDisabledProp(s),
          item: s
        }));
        if (!suggestions || !(this.highlightIndex < suggestions.length)) {
          this.highlightIndex = 0;
        }
      });
  }

  itemSourceAsAsync(query: string): Promise<string[]> {
    return Promise.resolve(null);
  }

  addItem(item: ItemType) {
    if (this._selectedItems.some(x => this.equalityComparer(x, item))
      || !item) {
      return;
    }
    this._selectedItems = [...this._selectedItems, item];
    this.selectedItemsChange.emit(this._selectedItems);
    this.clear();
  }

  removeItem(item: ItemType) {
    this._selectedItems = this._selectedItems
      .filter(i => !this.equalityComparer(i, item));
    this.selectedItemsChange.emit(this._selectedItems);
  }

  inputKeyDown(event: KeyboardEvent) {
    switch (event.which) {
      case KEYS.UP:
        // up
        this.highlightPrevious();
        event.preventDefault();
        break;
      case KEYS.DOWN:
        // down
        this.highlightNext();
        event.preventDefault();
        break;
      case KEYS.ENTER:
      case KEYS.TAB:
        // tab
        if (this.suggestions && this.suggestions.length) {
          const sug = this.suggestions[this.highlightIndex];
          if (!sug.disabled) {
            this.addItem(sug.item);
          }
          event.preventDefault();
        }
        break;
      case KEYS.BACKSPACE:
        if (!this.querySubject.value && this.selectedItems && this.selectedItems.length) {
          this.selectedItems = this.selectedItems.slice(0, this.selectedItems.length - 1);
          event.preventDefault();
        }
        break;
      case KEYS.ESC:
        this.querySubject.next(null);
        this.queryText = null;
        event.preventDefault();
        break;
    }
  }


  highlightPrevious() {
    if (!this.suggestions) return;
    this.highlightIndex = (this.highlightIndex + this.suggestions.length - 1) % this.suggestions.length;
  }

  highlightNext() {
    if (!this.suggestions) return;
    this.highlightIndex = (this.highlightIndex + 1) % this.suggestions.length;
  }

  inputInput(event: KeyboardEvent) {
    const query = (event.target as HTMLInputElement).value;
    this.queryText = query;
    this.querySubject.next(query);
  }

  clear() {
    this.queryText = null;
    this.querySubject.next(null);
  }

  inputBlur() {
    this.showSuggestions = false;
    this.queryText = null;
  }

}
