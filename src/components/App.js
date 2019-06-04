import './App.css';
import React, { Component } from 'react';
import WeatherList from './WeatherList';
import ZipForm from './ZipForm';
import CurrentDay from './CurrentDay';

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      timezoneOffset: -7, 
      zipcode: "",
      city: {},
      forecast: [],
      simpleForecast: [], 
      selectedDate: null
    };
    this.url = "http://api.openweathermap.org/data/2.5/forecast?zip=";
    this.apikey = "&units=imperial&appid="+process.env.REACT_APP_WEATHER_KEY;

    this.googleApiKey = process.env.REACT_APP_GOOGLE_KEY;
    this.googleMapsUrl = "https://maps.googleapis.com/maps/api/timezone/json?location=";

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onDayClicked = this.onDayClicked.bind(this);
  }

  onFormSubmit(zipcode) {
    fetch(`${this.url}${zipcode}${this.apikey}`)
	    .then(response => response.json())
        .then(data => { 
            const {city, list: forecast } = data; 
            fetch(`${this.googleMapsUrl}
                ${city.coord.lat},${city.coord.lon}
                &timestamp=${forecast[0].dt}
                &key=${this.googleApiKey}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                const timezoneOffset =  (data.rawOffset + data.dstOffset) / (60 * 60);
                const simpleForecast = this.parseForecast(forecast, timezoneOffset);
                zipcode = ""; 
                this.setState({zipcode, city, forecast, simpleForecast, timezoneOffset, selectedDate: null});         
            })
            .catch(googleError => {
                alert('There was a problem getting timezone info!')
            });
        })
        .catch(error => {
            alert('There was a problem getting info!'); 
        });
    }

  getIndexOfMidnight(firstDate, timezoneOffset) {
    let dt = firstDate * 1000;
    let date = new Date(dt);
    let utcHours = date.getUTCHours();
    let localHours = utcHours + timezoneOffset;
    let firstMidnightIndex = (localHours > 2 ) ? 
        Math.round((24 - localHours)/3) : 
        Math.abs(Math.round(localHours / 3));
    return firstMidnightIndex;
  }

  findMinTemp(forecast, indexOfMidnight) {
    let min = forecast[indexOfMidnight].main.temp_min;
    for (let i = indexOfMidnight + 1; i < indexOfMidnight + 8; i++)
      if (forecast[i].main.temp_min < min)
        min = forecast[i].main.temp_min;
    return min;
  }

  findMaxTemp(forecast, indexOfMidnight) {
    let max = forecast[indexOfMidnight].main.temp_max;
    for (let i = indexOfMidnight + 1; i < indexOfMidnight + 8; i++)
      if (forecast[i].main.temp_max > max)
        max = forecast[i].main.temp_max;
    return max;
  }

  parseForecast(forecast, timezoneOffset) {
    let simpleForecast = [];
    const MIDNIGHT = this.getIndexOfMidnight(forecast[0].dt, timezoneOffset);
    const NOON = 4;
    const SIXAM = 2;
    const SIXPM = 6;
    const NINEPM = 7;
    const MORNING = SIXAM;
    const DAY = NOON;
    const EVENING = SIXPM;
    const NIGHT = NINEPM;
    const PERDAY = 8;
    //const DAYS = 4;
    for (let i = MIDNIGHT; i < forecast.length - NINEPM; i+=PERDAY) {
      let oneDay = {};
      oneDay.dt = forecast[i + NOON].dt;
      oneDay.temp = forecast[i + NOON].main.temp;
      oneDay.minTemp = this.findMinTemp(forecast, i);
      oneDay.maxTemp = this.findMaxTemp(forecast, i);
      oneDay.morningTemp = forecast[i + MORNING].main.temp;
      oneDay.dayTemp = forecast[i + DAY].main.temp;
      oneDay.eveningTemp = forecast[i + EVENING].main.temp;
      oneDay.nightTemp = forecast[i + NIGHT].main.temp;
      oneDay.description = forecast[i + NOON].weather[0].description;
      oneDay.icon = forecast[i + NOON].weather[0].icon;
      oneDay.pressure = forecast[i + NOON].main.pressure;
      oneDay.wind = forecast[i + NOON].wind.speed;
      oneDay.humidity = forecast[i + NOON].main.humidity;
      simpleForecast.push(oneDay);
    }
    return simpleForecast;
  }

  onDayClicked(dayIndex) {
    this.setState({ selectedDate: dayIndex });
  }

  render() {
    const { simpleForecast, city, selectedDate } = this.state;
    return (
        <div id="app-container">
            <div className="app">
                <ZipForm onSubmit={this.onFormSubmit}/>
                <WeatherList forecastDays={simpleForecast} onDayClicked={this.onDayClicked} />
                {selectedDate !== null && <CurrentDay forecastDay={simpleForecast[selectedDate]} city={city} />}
            </div>
        </div>
    );
  }
}

export default App;
