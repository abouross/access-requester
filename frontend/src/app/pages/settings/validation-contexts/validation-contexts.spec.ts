import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationContexts } from './validation-contexts';

describe('ValidationContexts', () => {
  let component: ValidationContexts;
  let fixture: ComponentFixture<ValidationContexts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationContexts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidationContexts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
