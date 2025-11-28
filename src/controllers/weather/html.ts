import { WEATHER_DATA } from "../../constants";
import {dragItemIcon, WEATHER_ICONS} from "../../assets";

export const dayWeatherHtml = `
<div class="container">
  <div class="weather-info">
    <div class="date">
      <div class="country"></div>
      <div class="day"></div>
    </div>
    <div class="weather">
      <div class="temperature"></div>
      <div class="description"></div>
      <div class="icon"></div>
    </div>
  </div>
</div>`

export const dailyWeatherHtml = `
  <div class="container"></div>
`

export const weeklyWeatherDay = ({ time, min, max, code }:{time:number, min:number, max:number, code:number})=>{
  const date = new Date(time * 1000);
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short'});
  const day = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

  let image = ''
  let description = ''

  const weatherCondition = WEATHER_DATA.find(data => data.code.includes(code))
  if(weatherCondition){
    const icon = WEATHER_ICONS[`${weatherCondition.icon}_d` as keyof typeof WEATHER_ICONS]
    if(icon) {
      image = `<img src="${icon}" alt="${weatherCondition?.description}">`
    }
    description = weatherCondition.description ?? '-'
  }

  return `
    <div class="day">
      <div class="date"><span>${ weekday }</span>${ day }</div>
      <div class="weather">
        <div class="icon">${ image }</div>
        <div class="temperature">
          <span>${ Math.round(max) }°</span>
          <span>${ Math.round(min) }°</span>
        </div>
        <div class="description">${ description }</div>
      </div>
    </div>
  `
}



export const settingsMenuWeatherHtml = `
<h1>Weather</h1>
<div class="settings-menu-item">
  <div class="settings-item-content">
    <div class="item-content-row">
      <label for="geo-position">Location</label>
      <select name="geo-position" id="geo-position">
        <option value="auto">Auto</option>
        <option value="manual">Manual</option>
      </select>
    </div>
    <div id="geo-position-manual" class="item-content-row geo-position-manual">
      
      <div>
        <label for="city">City</label>
        <input id="city" name="city" type="text">
      </div>
      
      <div>
        <label for="lat">Latitude</label>
        <input id="lat" name="lat" type="text">
      </div>
      
      <div>
        <label for="lon">Longitude</label>
        <input id="lon" name="lon" type="text">
      </div>
      
    </div>
    <div class="item-content-row">
      
    </div>
  </div>
</div>
<div class="settings-menu-item">
  <label for="weather-active">Today Weather</label>
  <div class="switch-container">
    <input type="checkbox" id="weather-active" name="weather-active" role="switch">
  </div>
</div>`

export const settingsMenuDailyWeatherHtml = `
  <div class="menu-item-handle">${ dragItemIcon }</div>
  <label for="daily-weather-active">Daily Weather</label>
  <div class="switch-container">
    <input type="checkbox" id="daily-weather-active" name="daily-weather-active" role="switch">
  </div>`