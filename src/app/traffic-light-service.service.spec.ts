import { TestBed } from '@angular/core/testing';

import { Car, TrafficLight, TrafficLightService } from './traffic-light-service.service';

describe('TrafficLightService', () => {
  let service: TrafficLightService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrafficLightService);
  });

  // skip test automatically generated
  xit('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Test complete simulation', () => {
    const result = service.simulateRoadTraffic('C..CO....CG..', 6);
    expect(result).toEqual(["C..CO....CG..", ".C.CR.....C..", "..CCR.....GC.", "..CCR.....G.C", "..CCR.....G..", "..CCR.....O..", "...CC.....R.."]);
  });

  // test initial road parse
  it('This should parse the initial road correctly', () => {
    const result = service.parseInitialRoad('.C.C..R.C..G...');
    expect(result.cars.length).toBe(3);
    expect(result.trafficLigts.length).toBe(2);
    expect(result.roadLength).toBe(15);
    expect(result.cars).toEqual([{ position: 1 }, { position: 3 }, { position: 8 }]);
    expect(result.trafficLigts).toEqual([
      { position: 6, state: 'R', timer: 0 },
      { position: 11, state: 'G', timer: 0 },
    ]);
  });

  it('This call should fail due to invalide characters on input road', () => {
    expect(() => service.parseInitialRoad('..X2.Y..T.')).toThrowError('Invalid character in road string');
  });

  // Negative test over simulateRoadTraffic
  it('This call should fail due to empty road', () => {
    expect(() => service.simulateRoadTraffic('', 3)).toThrowError('Road cannot be empty');
  })

  it('This call should fail due to negative iterations', () => {
    expect(() => service.simulateRoadTraffic('..C.O..', -3)).toThrowError('Iterations cannot be negative');
  })

  //Tests for traffic light transition (`updateLights`)
  it('should transition traffic light from G to O when timer = 5', () => {
    const light: TrafficLight[] = [{ position: 3, state: 'G', timer: 4 }]
    // test G => O
    service.updateLights(light);
    expect(light[0].state).toBe('O');
    expect(light[0].timer).toBe(0);
  })

  it('should transition traffic light from O to R when timer = 1', () => {
    const light: TrafficLight[] = [{ position: 3, state: 'O', timer: 0 }]
    service.updateLights(light);
    expect(light[0].state).toBe('R');
    expect(light[0].timer).toBe(0);
  })

  it('should transition traffic light from R to G when timer = 5', () => {
    const light: TrafficLight[] = [{ position: 3, state: 'R', timer: 4 }]
    service.updateLights(light);
    expect(light[0].state).toBe('G');
    expect(light[0].timer).toBe(0);
  })

  it('This R traffic light should not transition', () => {
    const light: TrafficLight[] = [{ position: 3, state: 'R', timer: 2 }]
    service.updateLights(light);
    expect(light[0].state).toBe('R');
    expect(light[0].timer).toBe(3);
  })

  it('This G traffic light should not transition', () => {
    const light: TrafficLight[] = [{ position: 3, state: 'G', timer: 2 }]
    service.updateLights(light);
    expect(light[0].state).toBe('G');
    expect(light[0].timer).toBe(3);
  });

  // Tests for cars movement(`updateCarPosition`)
  it('Both cars should move', () => {
    const cars: Car[] = [{ position: 1 }, { position: 2 }];
    const road = '.CCG....';
    const light: TrafficLight[] = [{ position: 3, state: 'G', timer: 4 }];

    const carsUpdated = service.updateCarPosition(cars, road, light);
    expect(carsUpdated).toEqual([{ position: 3 }, { position: 2 }]);
  });


  it('Non car should move', () => {
    const cars: Car[] = [{ position: 1 }, { position: 2 }];
    const road = '.CCR....';
    const light: TrafficLight[] = [{ position: 3, state: 'R', timer: 4 }];

    const carsUpdated = service.updateCarPosition(cars, road, light);
    expect(carsUpdated).toEqual([{ position: 2 }, { position: 1 }]);
  });

  it('Just first car should move on', () => {
    const cars: Car[] = [{ position: 0 }, { position: 3 }];
    const road = 'C..CR....';
    const light: TrafficLight[] = [{ position: 4, state: 'R', timer: 4 }];

    const carsUpdated = service.updateCarPosition(cars, road, light);
    expect(carsUpdated).toEqual([{ position: 3 }, { position: 1 }]);
  });

  // Testing buildRoarString
  it('This should test final output array build', () => {
    const outputArray = service.buildRoadString(10, [{ position: 3 }], [{ position: 2, state: 'R', timer: 2 }]);
    expect(outputArray).toEqual('..RC......');
  });

  it('This test should throw an error due to trafficlight out of range', () => {
    expect(() => service.buildRoadString(10, [{ position: 3 }], [{ position: 13, state: 'R', timer: 2 }]))
      .toThrowError('Traffic light out of road range');
  });

  it('This test should throw an error due to car position out of range', () => {
    expect(() => service.buildRoadString(10, [{ position: 13 }], [{ position: 1, state: 'R', timer: 2 }]))
      .toThrowError('Car out of road range');
  });
});
