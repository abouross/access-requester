import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccessRequest } from './create-access-request';

describe('CreateAccessRequest', () => {
  let component: CreateAccessRequest;
  let fixture: ComponentFixture<CreateAccessRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAccessRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAccessRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
