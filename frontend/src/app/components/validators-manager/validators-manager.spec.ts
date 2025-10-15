import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatorsManager } from './validators-manager';

describe('ValidatorsManager', () => {
  let component: ValidatorsManager;
  let fixture: ComponentFixture<ValidatorsManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidatorsManager]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidatorsManager);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
