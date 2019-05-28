import './App.css';
import React, { Component } from 'react';
import WeatherList from './WeatherList';
import ZipForm from './ZipForm';
import CurrentDay from './CurrentDay';

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
        <div>App
          <ZipForm aProp="test"/>
          <WeatherList />
          <CurrentDay />
        </div>
    );
  }
}

export default App;
