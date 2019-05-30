import React, { Component } from 'react';
import WeatherListItem from './WeatherListItem';

class WeatherList extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    const { forecastDays, onDayClicked } = this.props;
    return (
        <div className="weather-list flex-parent">
            { forecastDays.map((forecastDay, index) =>
                <WeatherListItem
                    key={forecastDay.dt}
                    forecastDay={forecastDay}
                    index={index}
                    onDayClicked={onDayClicked}
                />
            ) }
        </div>
    );
  }
    
}

export default WeatherList;
