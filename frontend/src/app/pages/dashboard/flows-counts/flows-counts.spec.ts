import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowsCounts } from './flows-counts';

describe('FlowsCounts', () => {
  let component: FlowsCounts;
  let fixture: ComponentFixture<FlowsCounts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlowsCounts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlowsCounts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
