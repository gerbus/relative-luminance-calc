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

const getLum = ({r,g,b}) => {
  return getRelativeLuminance(`rgb(${r},${g},${b})`)
}
const ColorRow = ({rgb, lum}) => {
  const colorStyle = rgb ? {
    backgroundColor: `rgb(${rgb.r},${rgb.g},${rgb.b})`
  } : null;
  const grey = lum <= (0.03928/12.92) ? 12.92 * lum : (1.055 * Math.pow(10,Math.log10(lum)/2.4) - 0.055)
  const greyStyle = lum !== null ? {
    backgroundColor: `rgb(${grey*255},${grey*255},${grey*255})`
  } : null;

  return (
    <div className="colorRow">
      <div className="color" style={colorStyle}></div>
      <div className="grey" style={greyStyle}></div>
    </div>
  )
}

const red = { r: 255, g: 0, b: 0 };
const green = { r: 0, g: 255, b: 0 };
const blue = { r: 0, g: 0, b: 255 };
const baseHistory = [
  { rgb: red, lum: getLum(red) },
  { rgb: green, lum: getLum(green) },
  { rgb: blue, lum: getLum(blue) },
];
class RelativeLuminanceCalc extends Component {
  state = {
    lum: null,
    rgb: null ,
    history: localStorage.getItem('history') ? JSON.parse(localStorage.getItem('history')) : baseHistory
  }
  pushHistoryTimeout = null
  render() {
    const {
      lum,
      rgb
    } = this.state;

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
          <ColorRow rgb={rgb} lum={lum} />
        </div>
        <div className="history">
          {this.state.history.map((item, index) => <ColorRow rgb={item.rgb} lum={item.lum} />)}
        </div>
      </div>
    )
  }
  handleChange = (e) => {
    const val = e.target.value;
    const rgb = hexToRgb(val);
    const lum = rgb ? getLum(rgb) : null;

    clearTimeout(this.pushHistoryTimeout);
    const thisComponent = this;
    this.pushHistoryTimeout = setTimeout(() => {
      console.log("timeout")
      const history = JSON.parse(JSON.stringify(thisComponent.state.history));
      if (history.length) {
        const lastColor = history[0];
        if (lastColor.rgb.r === rgb.r && lastColor.rgb.g === rgb.g && lastColor.rgb.b === rgb.b) {
          return;
        }
      }

      const newHistoryItem = {rgb: rgb, lum: lum};
      history.unshift(newHistoryItem);
      localStorage.setItem('history', JSON.stringify(history));
      thisComponent.setState({
        history: history
      })
      thisComponent.pushHistoryTimeout = null;
    }, 1000)

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
