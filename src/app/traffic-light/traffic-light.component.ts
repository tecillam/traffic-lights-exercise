import { Component, inject } from '@angular/core';
import { TrafficLightService } from '../traffic-light-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-traffic-light',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './traffic-light.component.html',
  styleUrl: './traffic-light.component.scss'
})

export class TrafficLightComponent {

  roadStates: string[] = [];
  trafficLigtService = inject(TrafficLightService);

  constructor() { }

  ngOnInit() {
    const startingRoad = 'CCC.G.C.R...';
    const iterations = 16;

    this.roadStates = this.trafficLigtService.simulateRoadTraffic(startingRoad, iterations);
  }

}
