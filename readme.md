# tague

An auto-completing tagging control for angular 

[Demo](https://stackblitz.com/edit/angular-jgfknn)

## Usage

**Install**
```
npm i tague --save
```

**Import module**
```typescript
import {TagueModule} from 'tague';

@NgModule({
  declarations: [
  ],
  imports: [
    TagueModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

**Add to template**
```html

<tag-tague [id]="'abc'" [itemSource]="itemSource" [(selectedItems)]="selected"></tag-tague>

```

**Provide item source**
```typescript

class MyComponent{
  selected: string[] = ['one', 'two', 'three'];
  
  itemSource = ['Item one', 'Item two'];

  /* OR */

  itemSource = (queryText: string): string[] => {
    return ['Item one', 'Item two']
      .filter(x => x.toUpperCase().startsWith(queryText.toUpperCase()));
  };

  /* OR */

  itemSource = (queryText: string): Promise<string[]> => {
    return someService.get(queryText);  
  };
}

```
