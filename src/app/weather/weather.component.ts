import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { WeatherListFieldEnum } from 'app/shared/enums/weather-listfields-enum';
import { ICityListItem } from './weather.Interface';
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

    public model: IWeatherModel;
    public sortFields: any = WeatherListFieldEnum;

    constructor(
        private fb: FormBuilder,
        private _weatherService: WeatherService) { }
          
    ngOnInit(): void {

        this.model = {
            requestInProcess : false,
            filters : {
                sortField: WeatherListFieldEnum.Name,
                sortDesc: true
            },
            cityList: [],
            cityForm : this.createForm()
        }
        this._weatherService.getCurrentWeather('moscow');
    }
    onSubmit(): void {
        this.getWeatherData(this.model.cityForm.controls.city.value);
    }

    getWeatherData(input: string):void{
        this.startRequest()
        this._subscription = this._weatherService.getCurrentWeather('moscow').subscribe(res=> {
            if (Utils.IsObject(res))
                this.model.cityList.push(res as any)  
            this.completeRequest();    
        })
    }
         
    createForm() : FormGroup {
        return this.fb.group({
            city: new FormControl('',
                [Validators.required,
                Validators.minLength(2),
                Validators.maxLength(30)]
            )
        });
    }

    removeCity(location_id:number){
        this.model.cityList = this.model.cityList.filter(city => city.id != location_id)
    }  

    sortCityList(field: WeatherListFieldEnum){
        if(field == this.model.filters.sortField) 
            this.model.filters.sortDesc = !this.model.filters.sortDesc
        else  
            this.model.filters.sortField = field;

        this.model.cityList = this.model.filters.sortDesc 
            ? Utils.Array.OrderByDescending(this.model.cityList, d => d[this.model.filters.sortField]) 
            : Utils.Array.OrderBy(this.model.cityList, d => d[this.model.filters.sortField]);  
    }

    private startRequest(): void {
        this.model.requestInProcess = true;
    }
    private completeRequest(): void {
        this.model.requestInProcess = false;
    }
    ngOnDestroy() {
        this._subscription && this._subscription.unsubscribe();
    }
}

export interface IWeatherModel{
    requestInProcess: boolean,
    filters:  {
        sortField: WeatherListFieldEnum,
        sortDesc: boolean
    }
    cityForm: FormGroup,
    cityList: ICityListItem[];
}

