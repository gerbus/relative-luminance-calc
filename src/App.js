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
  state = { lum: null, rgb: null }
  render() {
    const {
      lum,
      rgb
    } = this.state;
    const colorStyle = rgb ? {
      backgroundColor: `rgb(${rgb.r},${rgb.g},${rgb.b})`
    } : null;
    const grey = lum <= (0.03928/12.92) ? 12.92 * lum : (1.055 * Math.pow(10,Math.log10(lum)/2.4) - 0.055)
    const greyStyle = lum !== null ? {
      backgroundColor: `rgb(${grey*255},${grey*255},${grey*255})`
    } : null;

    return (
      <div className="container">
        <div className="numbers">
          <div>
            <label htmlFor="hex">Color (hex): </label>
            <input id="hex" onChange={this.handleChange} />
          </div>
          <div>
            <label htmlFor="rgb">Color (rgb): </label>
            <input disabled id="rgb" value={rgb ? `${rgb.r},${rgb.g},${rgb.b}` : ""} />
          </div>
          <div>
            <label htmlFor="lum">Relative luminance [0,1]: </label>
            <input disabled id="lum" value={lum ? lum : ""} />
          </div>
        </div>
        <div className="colors">
          <div className="color" style={colorStyle}></div>
          <div className="grey" style={greyStyle}></div>
        </div>
      </div>
    )
  }
  handleChange = (e) => {
    const val = e.target.value;
    const rgb = hexToRgb(val);
    const lum = rgb ? getRelativeLuminance(`rgb(${rgb.r},${rgb.g},${rgb.b})`) : null;
    this.setState({
      lum: lum,
      rgb: rgb,
    })
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
