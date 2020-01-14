import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { tap, map } from 'rxjs/operators';
import { WeatherListFieldEnum } from 'app/shared/enums/weather-listfields-enum';
import { CityListItem } from 'app/shared/interfaces/city-list-item.Interface';
import {
    WeatherService,
    Utils
} from '@shared';

@Component({
    templateUrl: './weather.component.html',
    styleUrls: ['./weather.component.less']
})

export class WeatherComponent implements OnInit  {
    private _subscription: Subscription;
    public sortFields: any = WeatherListFieldEnum;
    public publishersFilterAutocomplete: any;
    public filters={
        sortField: WeatherListFieldEnum.Name,
        sortDesc: true
    }
    public cityForm: FormGroup;
    public cityList: CityListItem[] = [];

    constructor(
        private fb: FormBuilder,
        private _weatherService: WeatherService) { }
          
    ngOnInit(): void {
        this.createForm();
        this._weatherService.getCurrentWeather('moscow');
    }

    getWeatherData(input: string){
        this._subscription = this._weatherService.getCurrentWeather('moscow').pipe(
             tap(ev => console.log(ev)),
             map(data => Utils.Object.Extend({}, {'name': data.location}, data.weather))
        ).subscribe(res=> {
            if (Utils.IsObject(res))
                this.cityList.push(res as CityListItem)  
        })
    }

    createForm() {
        this.cityForm = this.fb.group({
            city: new FormControl()
        });
    }

    removeCity(name:string){
        this.cityList = this.cityList.filter(city => city.name != name)
    }  

    sort(field: WeatherListFieldEnum){
        if(field == this.filters.sortField) 
            this.filters.sortDesc = !this.filters.sortDesc
        else  
            this.filters.sortField = field;

        this.cityList = this.filters.sortDesc 
            ? Utils.Array.OrderByDescending(this.cityList, d => d[this.filters.sortField]) 
            : Utils.Array.OrderBy(this.cityList, d => d[this.filters.sortField]);  
    }

    ngOnDestroy() {
        this._subscription && this._subscription.unsubscribe();
    }
}


