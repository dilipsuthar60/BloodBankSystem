import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCampComponent } from './create-camp.component';

describe('CreateCampComponent', () => {
  let component: CreateCampComponent;
  let fixture: ComponentFixture<CreateCampComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCampComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
