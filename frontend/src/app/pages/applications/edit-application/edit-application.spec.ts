import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditApplication } from './edit-application';

describe('EditApplication', () => {
  let component: EditApplication;
  let fixture: ComponentFixture<EditApplication>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditApplication]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditApplication);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
