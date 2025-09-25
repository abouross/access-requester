import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LoadingProgress} from './loading-progress';

describe('LoadingProgress', () => {
  let component: LoadingProgress;
  let fixture: ComponentFixture<LoadingProgress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingProgress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingProgress);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
