import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFlow } from './edit-flow';

describe('EditFlow', () => {
  let component: EditFlow;
  let fixture: ComponentFixture<EditFlow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFlow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFlow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
