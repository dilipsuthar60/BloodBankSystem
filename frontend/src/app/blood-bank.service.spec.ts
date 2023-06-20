import { TestBed } from '@angular/core/testing';

import { BloodBankService } from './blood-bank.service';

describe('BloodBankService', () => {
  let service: BloodBankService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BloodBankService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
