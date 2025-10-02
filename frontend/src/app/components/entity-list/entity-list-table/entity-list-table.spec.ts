import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityListTable } from './entity-list-table';

describe('EntityListTable', () => {
  let component: EntityListTable;
  let fixture: ComponentFixture<EntityListTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityListTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityListTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
