import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrafficLightService } from '../traffic-light-service.service';
import { TrafficLightComponent } from './traffic-light.component';
import { of } from 'rxjs';

describe('TrafficLightComponent', () => {
  let component: TrafficLightComponent;
  let fixture: ComponentFixture<TrafficLightComponent>;
  let mockTrafficLightService: jasmine.SpyObj<TrafficLightService>;

  beforeEach(async () => {
    mockTrafficLightService = jasmine.createSpyObj('TrafficLightService', ['simulateRoadTraffic']);
    mockTrafficLightService.simulateRoadTraffic.and.returnValue(['initial_mock_road', 'step1_mock_road']);

    await TestBed.configureTestingModule({
      imports: [TrafficLightComponent],
      providers: [{ provide: TrafficLightService, useValue: mockTrafficLightService }]
    }).compileComponents();

    fixture = TestBed.createComponent(TrafficLightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Should test service consumption', () => {
    expect(mockTrafficLightService.simulateRoadTraffic).toHaveBeenCalled();
  })

  
});
