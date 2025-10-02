import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationSheet } from './confirmation-sheet';

describe('ConfirmationSheet', () => {
  let component: ConfirmationSheet;
  let fixture: ComponentFixture<ConfirmationSheet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationSheet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationSheet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
