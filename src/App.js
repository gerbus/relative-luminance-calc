import React, { Component } from 'react';
import getRelativeLuminance from 'get-relative-luminance';

import './App.css';

function App() {
  return (
    <div className="App">
      <RelativeLuminanceCalc />
    </div>
  );
}

class RelativeLuminanceCalc extends Component {
  state = { lum: null }
  render() {
    return (
      <>
        <input onChange={this.handleChange} />
        <div>Relative luminance: {this.state.lum}</div>
      </>
    )
  }
  handleChange = (e) => {
    const val = e.target.value;
    const rgb = hexToRgb(val);
    const lum = rgb ? getRelativeLuminance(`rgb(${rgb.r},${rgb.g},${rgb.b})`) : null;
    this.setState({lum: lum})
  }
}

function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export default App;
