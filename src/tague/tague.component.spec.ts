import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagueComponent } from './tague.component';

describe('TagueComponent', () => {
  let component: TagueComponent;
  let fixture: ComponentFixture<TagueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
