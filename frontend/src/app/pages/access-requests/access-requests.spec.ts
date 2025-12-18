import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessRequests } from './access-requests';

describe('AccessRequests', () => {
  let component: AccessRequests;
  let fixture: ComponentFixture<AccessRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessRequests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessRequests);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
