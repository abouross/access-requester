import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Delegations } from './delegations';

describe('Delegations', () => {
  let component: Delegations;
  let fixture: ComponentFixture<Delegations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Delegations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Delegations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
