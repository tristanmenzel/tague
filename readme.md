# tague

An auto-completing tagging control for angular 

[Demo](https://stackblitz.com/edit/angular-jgfknn)

## Basic Usage

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

<tag-tague inputId="abc" [itemSource]="itemSource" [(selectedItems)]="selected"></tag-tague>

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


## Object for item source

**Template**
```html

<tag-tague inputId="abc" 
           [itemSource]="itemSource" 
           [(selectedItems)]="selected"
           displayProp="name"
           disabledProp="disabled"></tag-tague>

```

**ViewModel**
```typescript

class MyComponent{
  // Objects are compared with shallow equality, or you can override using 
  // the equalityComparer prop  (a:T,b:T) => boolean
  selected: string[] = [{
    name: 'One',
    disabled: false
    }]; 
  
  itemSource = [{
    name: 'One',
    disabled: false
    }, {
    name: 'Two',
    disabled: true
    }
  ];

}

```
