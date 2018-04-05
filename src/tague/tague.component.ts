import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/switchMap';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


export declare type ItemSourceDelegate = (query: string) => string[];
export declare type AsyncItemSourceDelegate = (query: string) => Promise<string[]>;

export declare type ItemSource = ItemSourceDelegate | AsyncItemSourceDelegate | string[];

export declare type ItemType = string | { [key: string]: string };


@Component({
  selector: 'tag-tague',
  templateUrl: './tague.component.html',
  styleUrls: ['./tague.component.scss']
})
export class TagueComponent {

  private _selectedItems: ItemType[] = [];

  public querySubject: BehaviorSubject<string> = new BehaviorSubject(null);

  public suggestions: ItemType[];

  public highlightIndex = 0;

  public queryText: string = null;

  @Input('inputId') id: string = 'tague-component';

  @Input() displayProp: string = null;

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
        return Promise.resolve(query === null ? [] : value
          .filter(x => this.getDisplayText(x).toUpperCase().startsWith(query.toUpperCase())));
      };
    } else {
      this.itemSourceAsAsync = (query: string) => {
        if (query === null) {
          return Promise.resolve([]);
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
    if (typeof a === 'string') {
      return a === b;
    } else {
      return Object.keys(a)
        .every(k => a[k] === b[k]);
    }
  };

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

  constructor() {
    this.querySubject
      .asObservable()
      .switchMap(val => Observable.fromPromise(this.itemSourceAsAsync(val)))
      .subscribe(suggestions => {
        this.suggestions = suggestions;
        if (!(this.highlightIndex < suggestions.length)) {
          this.highlightIndex = 0;
        }
      });
  }

  itemSourceAsAsync(query: string): Promise<string[]> {
    return Promise.resolve([]);
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
      case 38:
        // up
        this.highlightPrevious();
        event.preventDefault();
        break;
      case 40:
        // down
        this.highlightNext();
        event.preventDefault();
        break;
      case 9:
        if (this.suggestions && this.suggestions.length) {
          this.addItem(this.suggestions[this.highlightIndex]);
          event.preventDefault();
        }
        break;
    }
  }


  highlightPrevious() {
    this.highlightIndex = (this.highlightIndex + this.suggestions.length - 1) % this.suggestions.length;
  }

  highlightNext() {
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
    setTimeout(() => {
      this.clear();
    }, 500);
  }

}
