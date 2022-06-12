import { TestBed } from '@angular/core/testing';

import { VoiceTextService } from './voice-text.service';

describe('VoiceTextService', () => {
  let service: VoiceTextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoiceTextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
