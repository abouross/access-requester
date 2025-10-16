import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationFlows } from './validation-flows';

describe('ValidationFlows', () => {
  let component: ValidationFlows;
  let fixture: ComponentFixture<ValidationFlows>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationFlows]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidationFlows);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
