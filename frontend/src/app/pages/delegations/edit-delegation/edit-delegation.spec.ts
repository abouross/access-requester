import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDelegation } from './edit-delegation';

describe('EditDelegation', () => {
  let component: EditDelegation;
  let fixture: ComponentFixture<EditDelegation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDelegation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDelegation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
