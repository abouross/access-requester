import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateContext } from './create-context';

describe('CreateContext', () => {
  let component: CreateContext;
  let fixture: ComponentFixture<CreateContext>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateContext]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateContext);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
