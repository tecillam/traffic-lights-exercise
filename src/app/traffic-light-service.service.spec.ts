import { TestBed } from '@angular/core/testing';

import { TrafficLightServiceService } from './traffic-light-service.service';

describe('TrafficLightServiceService', () => {
  let service: TrafficLightServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrafficLightServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
