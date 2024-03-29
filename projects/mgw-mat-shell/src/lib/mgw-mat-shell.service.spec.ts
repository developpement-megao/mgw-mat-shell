import { TestBed } from '@angular/core/testing';

import { MgwMatShellService } from './mgw-mat-shell.service';

describe('MgwMatShellService', () => {
  let service: MgwMatShellService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MgwMatShellService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
