import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityFormRows } from './entity-form-rows';

describe('EntityFormRows', () => {
  let component: EntityFormRows;
  let fixture: ComponentFixture<EntityFormRows>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityFormRows]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityFormRows);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
