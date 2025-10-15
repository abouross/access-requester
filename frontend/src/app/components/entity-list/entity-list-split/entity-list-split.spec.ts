import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityListSplit } from './entity-list-split';

describe('EntityListSplit', () => {
  let component: EntityListSplit;
  let fixture: ComponentFixture<EntityListSplit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityListSplit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityListSplit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
