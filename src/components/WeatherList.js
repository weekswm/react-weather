import React, { Component } from 'react';
import WeatherListItem from './WeatherListItem';

class WeatherList extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
        <div>WeatherList
          <WeatherListItem />
        </div>
    );
  }
}

export default WeatherList;
