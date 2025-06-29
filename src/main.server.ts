import { bootstrapApplication } from '@angular/platform-browser';
import { config } from './app/app.config.server';
import { TrafficLightComponent } from './app/traffic-light/traffic-light.component';

const bootstrap = () => bootstrapApplication(TrafficLightComponent, config);

export default bootstrap;
