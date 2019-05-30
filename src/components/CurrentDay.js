import React, { Component } from 'react';

class CurrentDay extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }
  
  getWeekday(date) {
    const dayNames = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekday = date.getDay();
    return dayNames[weekday];
  } 

  render() {
    const { city, forecastDay } = this.props;
    const date = new Date(forecastDay.dt * 1000);
    const weekday = this.getWeekday(date);

    return (
        <div className="current-day">
        <h1 className="day-header">{weekday} in {city.name}</h1>
        <div className="weather">
            <p>
                <img src={`http://openweathermap.org/img/w/${forecastDay.icon}.png`} alt={forecastDay.description}/>
                {forecastDay.description}
            </p>
            </div>
        <div className="details flex-parent">
            <div className="temperature-breakdown">
            <p>Morning Temperature: {forecastDay.morningTemp}&deg;F</p>
            <p>Day Temperature: {forecastDay.dayTemp}&deg;F</p>
            <p>Evening Temperature: {forecastDay.eveningTemp}&deg;F</p>
            <p>Night Temperature: {forecastDay.nightTemp}&deg;F</p>
            </div>
            <div className="misc-details">
            <p>Atmospheric Pressure: {forecastDay.pressure} hPa</p>
            <p>Humidity: {forecastDay.humidity}%</p>
            <p>Wind Speed: {forecastDay.wind} mph</p>
            </div>
        </div>
        </div>
    );
  }
}

export default CurrentDay;
