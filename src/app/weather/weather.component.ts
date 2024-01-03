import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  
  constructor() { }
  error:boolean=false;
  pressure:any;
  location:any = "chennai";
  WeatherData:any;
  currentTime:string|undefined; 

  ngOnInit(){
    this.WeatherData = {
      main : {},
      isDay: false
    }; 
   if(sessionStorage.getItem("city")!=null){
   this.location = sessionStorage.getItem("city")
   }
   this.getWeatherData();
  }
  getWeatherData(){
   fetch('https://api.openweathermap.org/data/2.5/weather?q='+this.location+'&appid=ff1bc4683fc7325e9c57e586c20cc03e') 
   .then(response=>response.json())
   .then(data=>{this.setWeatherData(data);})
   .catch(()=>this.error=true)
   sessionStorage.setItem("city", "chennai");
  }
  
  setWeatherData(data: any){
    this.WeatherData = data;
    this.WeatherData.pressure = data.main.pressure;
    let sunsetTime = new Date(this.WeatherData.sys.sunset * 1000);
    let sunriseTime = new Date(this.WeatherData.sys.sunrise * 1000);
    let currentTime = new Date();
    let time = new Date(currentTime.getTime() + (currentTime.getTimezoneOffset() * 60000));
    let sunset = new Date(sunsetTime.getTime() + (sunsetTime.getTimezoneOffset() * 60000));
    let sunrise = new Date(sunriseTime.getTime() + (sunriseTime.getTimezoneOffset() * 60000));
    this.currentTime = time.toLocaleTimeString()+" UTC";

    this.WeatherData.isDay = (time.getTime() < sunset.getTime() && time.getTime() > sunrise.getTime());
    this.WeatherData.temp_celcius = (this.WeatherData.main.temp - 273.15).toFixed(0);
    this.WeatherData.temp_min = (this.WeatherData.main.temp_min - 273.15).toFixed(0);
    this.WeatherData.temp_max = (this.WeatherData.main.temp_max - 273.15).toFixed(0);
    this.WeatherData.temp_feels_like = (this.WeatherData.main.feels_like - 273.15).toFixed(0);
    this.WeatherData.humidity = data.main.humidity;
    this.WeatherData.speed = data.wind.speed;
    this.WeatherData.main = data.weather[0].description; 
  }
  
  cityName(){
    let city:any = document.getElementById("city");
    sessionStorage.setItem("city", city.value);
  }
  }