import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersCounts } from './users-counts';

describe('UsersCounts', () => {
  let component: UsersCounts;
  let fixture: ComponentFixture<UsersCounts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersCounts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersCounts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
