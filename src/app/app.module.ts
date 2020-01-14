import { BrowserModule } from '@angular/platform-browser';
import { NgModule,Injector } from '@angular/core';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import {WeatherModule} from './weather/weather.module';
import {
  SharedModule,
  ServiceLocator
} from './shared';
import { from } from 'rxjs';
import { PageNotFoundComponent } from './page-not-found.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule.forRoot(),
    WeatherModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(injector: Injector) {
      ServiceLocator.Injector = injector;
  }
}
