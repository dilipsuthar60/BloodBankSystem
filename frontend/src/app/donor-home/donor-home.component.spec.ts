import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorHomeComponent } from './donor-home.component';

describe('DonorHomeComponent', () => {
  let component: DonorHomeComponent;
  let fixture: ComponentFixture<DonorHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonorHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonorHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
