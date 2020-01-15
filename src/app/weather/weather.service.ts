import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { map ,tap, retry} from 'rxjs/operators';
import { Utils } from '@shared';
import { ICityListItem } from './weather.Interface';
import { error } from 'util';
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
    return  this.http.get<any>(environment.apiUrl, {
      headers: httpOptions.headers,
      params:{
        q: loc,
        appid: environment.appid
      }
    }).pipe(
      // tap({
      //   error: error => {
      //     console.log('on error', error.message);
      //   }
      // }),
     // retry(2),
      map(data => this.getMockData())
    )
  }
  private getMockData(): ICityListItem {
    let serverData = { location:"London", id: Math.floor(Math.random() * 10) + 1,  otherinfo:{dome_data: ""},  weather: { tempereture :"20", atmosphere : "323" }};
    return Utils.Object.Extend({},<ICityListItem>{ location: serverData.location, id: serverData.id, temperature: Number(serverData.weather.tempereture),  atmosphere:  Number(serverData.weather.atmosphere)});
  }
}
