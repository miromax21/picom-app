import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared';
import { WheatherRoutingModule } from './weather-routing.module';
import { WeatherComponent } from './weather.component';
import { WeatherService } from './weather.service';
import { from } from 'rxjs';

@NgModule({
    imports: [
        CommonModule,
        WheatherRoutingModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [WeatherComponent],
    providers: [WeatherService]
})
export class WeatherModule { 
}