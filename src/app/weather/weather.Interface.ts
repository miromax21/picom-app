export interface ICityListItem{
    id:number,
    location: string,
    temperature: number,
    atmosphere:number,

} 

export interface IWeatherData {
    main: IMain,
    name: string,
    id:number
  }
  export interface IMain{
    temp: number,
    pressure:  number,
    humidity:  number,
    temp_min:  number,
    temp_max:  number,
}
  
export interface IServerData{
    main: IMain,
    name: string,
    id: number
  }
