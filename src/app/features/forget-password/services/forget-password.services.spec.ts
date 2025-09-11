import { TestBed } from '@angular/core/testing';

import { ForgetPasswordServices } from './forget-password.services';

describe('ForgetPasswordServices', () => {
  let service: ForgetPasswordServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForgetPasswordServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
