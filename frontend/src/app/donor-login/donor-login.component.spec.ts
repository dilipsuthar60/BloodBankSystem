import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorLoginComponent } from './donor-login.component';

describe('DonorLoginComponent', () => {
  let component: DonorLoginComponent;
  let fixture: ComponentFixture<DonorLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonorLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonorLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
