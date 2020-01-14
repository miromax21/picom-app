import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { of } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/xml',
    'Authorization': 'jwt-token',
    'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
    'x-rapidapi-key': 'SIGN-UP-FOR-KEY'
  })
};
@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  constructor(private http: HttpClient) { }


  getCurrentWeather(loc: string) {
    const headerOprions = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'});
 
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'my-auth-token'
      })
    };
     this.http.get<any>(environment.apiUrl, {
      headers: httpOptions.headers,
      params:{
        q: loc,
        appid: environment.appid
      }
    }).toPromise().then((e)=>{
      console.log(e);
    })

    var data = {
      location:"London",
      otherinfo:"",
      weather: 
        { tempereture :"20", atmosphere : "323" }
    }
    return of(data);
  }
}
