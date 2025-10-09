import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessRequestCounts } from './access-request-counts';

describe('AccessRequestCounts', () => {
  let component: AccessRequestCounts;
  let fixture: ComponentFixture<AccessRequestCounts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessRequestCounts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessRequestCounts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
