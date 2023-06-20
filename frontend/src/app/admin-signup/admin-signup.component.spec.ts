import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSignupComponent } from './admin-signup.component';

describe('AdminSignupComponent', () => {
  let component: AdminSignupComponent;
  let fixture: ComponentFixture<AdminSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminSignupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
