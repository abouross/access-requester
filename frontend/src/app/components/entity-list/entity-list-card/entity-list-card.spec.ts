import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityListCard } from './entity-list-card';

describe('EntityListCard', () => {
  let component: EntityListCard;
  let fixture: ComponentFixture<EntityListCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityListCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityListCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
