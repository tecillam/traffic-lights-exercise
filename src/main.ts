import { bootstrapApplication } from '@angular/platform-browser';
import { TrafficLightComponent } from './app/traffic-light/traffic-light.component';

bootstrapApplication(TrafficLightComponent)
  .catch((err) => console.error(err));
