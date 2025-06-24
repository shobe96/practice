import { TestBed } from '@angular/core/testing';

import { CustomMessageService } from './custom-message.service';
import { MessageService } from 'primeng/api';

describe('CustomMessageService', () => {
  let service: CustomMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessageService]
    });
    service = TestBed.inject(CustomMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
