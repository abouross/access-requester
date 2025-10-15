import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditContext } from './edit-context';

describe('EditContext', () => {
  let component: EditContext;
  let fixture: ComponentFixture<EditContext>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditContext]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditContext);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
