import { Injectable } from '@angular/core';

export interface TrafficLight {
  position: number;
  state: 'G' | 'O' | 'R';
  timer: number;
}

export interface Car {
  position: number;
}

@Injectable({
  providedIn: 'root'
})
export class TrafficLightService {

  simulateRoadTraffic(road: string, n: number): string[] {
    if (!road || road.length === 0) {
      throw new Error('Road cannot be empty');
    }

    if (n < 0) {
      throw new Error('Iterations cannot be negative');
    }
    const outputArray: string[] = [];
    const { cars, trafficLigts, roadLength } = this.parseInitialRoad(road);

    // Add initial status
    outputArray.push(road);

    let currentCars = cars;
    let currentLights = trafficLigts;

    for (let i = 0; i < n; i++) {
      //Update lights
      this.updateLights(currentLights);

      // update cars movement
      currentCars = this.updateCarPosition(currentCars, road, currentLights);

      const newRoadStatus = this.buildRoadString(roadLength, currentCars, currentLights);

      outputArray.push(newRoadStatus);
    }

    return outputArray;

  }

  // Save initial cars and lights positions
  parseInitialRoad(road: string): { cars: Car[], trafficLigts: TrafficLight[], roadLength: number } {
    const finalRoad = road.toUpperCase();
    const trafficLigts: TrafficLight[] = [];
    const cars: Car[] = [];

    for (let i = 0; i < finalRoad.length; i++) {
      const char = finalRoad[i];

      if (char == 'C') cars.push({ position: i });

      if (char == 'G' || char === 'O' || char === 'R') {
        trafficLigts.push({
          position: i,
          state: char,
          timer: 0
        })
      }
      if (char !== 'G' && char !== 'O' && char !== 'R' && char !== 'C' && char !== '.') {
        throw new Error('Invalid character in road string');
      }
    }

    return { cars, trafficLigts, roadLength: finalRoad.length };
  }

  // Manage traffic lights color change
  updateLights(lights: TrafficLight[]) {
    lights.forEach(light => {
      light.timer++;
      switch (light.state) {
        case 'G': // G turns O after 5 runs
          if (light.timer >= 5) {
            light.timer = 0;
            light.state = 'O';
          }
          break;
        case 'O': // O turns R after 1 runs
          if (light.timer >= 1) {
            light.timer = 0;
            light.state = 'R';
          }
          break;
        case 'R': // R turns G after 5 runs
          if (light.timer >= 5) {
            light.timer = 0;
            light.state = 'G';
          }
          break;
      }
    })
  }

  // Logic for car movement
  updateCarPosition(cars: Car[], road: string, lights: TrafficLight[]) {
    const updatedCars: Car[] = [];
    cars.sort((a, b) => a.position - b.position);

    // array with last position for each car after each iteration
    let finalCarsPosition = cars.map(car => car.position)

    for (let i = cars.length - 1; i >= 0; i--) {
      const car = cars[i];
      const nextSpot = car.position + 1;
      let moveOn = true;

      if (nextSpot >= road.length) continue; // If there no more road this car shouldn't be added

      let light = lights.find(l => l.position == nextSpot);
      if (light) { // Verify if there is a light on next position
        if (light.state == 'R') { // If R light on next position stop
          moveOn = false;
        } else if (light.state == 'O') {
          if (car.position !== light.position) { // If light is O move on just if car position is the same as light
            moveOn = false;
          }
        }
      }

      if (finalCarsPosition.includes(nextSpot)) {
        moveOn = false;
      }


      if (moveOn) {
        updatedCars.push({ position: nextSpot });
        finalCarsPosition[i] = nextSpot;
      } else {
        updatedCars.push({ position: car.position })
      }
    };
    return updatedCars;
  }

  buildRoadString(roadLength: number, cars: Car[], lights: TrafficLight[]): string {
    const newRoadArray = new Array(roadLength).fill('.');

    lights.forEach(light => {
      if (light.position > roadLength) {
        throw new Error('Traffic light out of road range')
      }
      newRoadArray[light.position] = light.state;
    });

    cars.forEach(car => {
      if (car.position > roadLength) {
        throw new Error('Car out of road range')
      }
      newRoadArray[car.position] = 'C';
    });

    return newRoadArray.join('');
  }
}
