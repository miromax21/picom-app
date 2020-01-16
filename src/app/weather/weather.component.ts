import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { WeatherListFieldEnum } from 'app/shared/enums/weather-listfields-enum';
import { ICityListItem,IWeatherData, IMain } from './weather.Interface';
import { map ,tap, retry} from 'rxjs/operators';
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
        this.initModel();
    }

    initModel():void{

        this.model = {
            requestInProcess : false,
            filters : {
                sortField: WeatherListFieldEnum.Name,
                sortDesc: true
            },
            cityList: [],
            cityForm : this.fb.group({
                city: new FormControl('',[
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(30),
                    Validators.pattern("[A-zА-я]+$") ]
                )
            })
        }
     }    

    onSubmit(): void {
        this.getWeatherData(this.model.cityForm.controls.city.value);
    }

    getWeatherData(city: string):void{

        this.startRequest();
        this._subscription = this._weatherService.getCurrentWeather(city)
            .pipe( 
                tap(null,
                    err => {
                        this.completeRequest();
                        this.model.cityForm.controls['city'].setErrors({'incorrect': true});
                    }                
                ),
                map(data => Utils.IsObject(data) && Utils.Object.Extend({},{id :  data.id, location : data.name,temperature : data.main.temp, atmosphere: data.main.pressure }))
            ).subscribe((res :ICityListItem) => {     
                this.model.cityList.push(res);
                this.completeRequest(); 
                this.model.cityForm.reset();  
                   
            });

    }

    removeCity(location_id:number):void{
        this.model.cityList = this.model.cityList.filter(city => city.id != location_id);
    }  

    sortCityList(field: WeatherListFieldEnum):void{
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

