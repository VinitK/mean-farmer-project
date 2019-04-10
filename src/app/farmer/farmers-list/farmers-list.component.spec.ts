import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmersListComponent } from './farmers-list.component';

describe('FarmersListComponent', () => {
  let component: FarmersListComponent;
  let fixture: ComponentFixture<FarmersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
