import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFlow } from './create-flow';

describe('CreateFlow', () => {
  let component: CreateFlow;
  let fixture: ComponentFixture<CreateFlow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateFlow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateFlow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
