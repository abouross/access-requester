import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateApplication } from './create-application';

describe('CreateApplication', () => {
  let component: CreateApplication;
  let fixture: ComponentFixture<CreateApplication>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateApplication]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateApplication);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
