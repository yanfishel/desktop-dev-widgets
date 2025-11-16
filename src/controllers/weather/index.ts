import {getStorageItem, getWidgetsSettings, setStorageItem, setWidgetsSetting} from "../../utils";
import {dailyWeatherHtml, dayWeatherHtml, settingsMenuWeatherHtml, weeklyWeatherDay} from "./html";

import "./style.css"
import {WEATHER_DATA, WEATHER_ICONS} from "../../constans";


class WeatherController {
  static instance: WeatherController | null = null

  #widgetsSettings:IWidgetsSettings

  #globalTimeinput: HTMLInputElement

  #date: HTMLElement
  #country: HTMLElement
  #temp: HTMLElement
  #weatherIcon: HTMLElement
  #weatherDescription: HTMLElement


  constructor() {
    const settings = getWidgetsSettings()
    this.#widgetsSettings = settings
  }


  static getInstance() {
    if (!WeatherController.instance) {
      WeatherController.instance = new WeatherController()
    }

    return WeatherController.instance
  }

  init(){
    this.getGeoPosition()
  }

  async build(container: HTMLElement) {
    const settings = getWidgetsSettings()

    const elem = document.createElement('div')
    elem.id = 'weather-widget'
    elem.style.display = settings.weather.active ? 'block' : 'none'
    elem.innerHTML = dayWeatherHtml

    this.#date = elem.querySelector('.day')
    this.#country = elem.querySelector('.country')
    this.#temp = elem.querySelector('.temperature')
    this.#weatherIcon = elem.querySelector('.icon')
    this.#weatherDescription = elem.querySelector('.description')

    this.#globalTimeinput = document.getElementById('global-time') as HTMLInputElement

    this.updateDate()

    container.appendChild(elem)

    this.weatherDaily(container)

    this.#globalTimeinput.addEventListener('change', this.timeListener)

    this.updateWeather(true)
  }

  async weatherDaily(container: HTMLElement){
    const settings = getWidgetsSettings()

    const elem = document.createElement('div')
    elem.id = 'daily-weather-widget'
    elem.style.display = settings.dailyWeather.active ? 'block' : 'none'
    elem.innerHTML = dailyWeatherHtml

    container.appendChild(elem)

    this.#globalTimeinput.addEventListener('change', this.dailyTimeListener)
    this.updateWeatherDaily()
  }

  settingsMenuElement() {
    const element = document.createElement('span')
    element.innerHTML = settingsMenuWeatherHtml

    const settings = getWidgetsSettings()

    const weatherCheckbox:HTMLInputElement = element.querySelector('input[name="weather-active"]')
    weatherCheckbox.checked = settings.weather.active

    weatherCheckbox.addEventListener('change', (e:any)=> {
      setWidgetsSetting('weather', {active: e.target.checked})
      this.toggleWeather(e.target.checked)
    })

    const dailyWeatherCheckbox:HTMLInputElement = element.querySelector('input[name="daily-weather-active"]')
    dailyWeatherCheckbox.checked = settings.dailyWeather.active

    dailyWeatherCheckbox.addEventListener('change', (e:any)=> {
      setWidgetsSetting('dailyWeather', {active: e.target.checked})
      this.toggledailyWeather(e.target.checked)
    })

    const manualGeoPositionBlock:HTMLElement = element.querySelector('.geo-position-manual')
    manualGeoPositionBlock.style.display = settings.autoGeoPosition ? 'none' : 'flex'
    const geoPositionSelect:HTMLSelectElement = element.querySelector('select[name="geo-position"]')
    geoPositionSelect.value = settings.autoGeoPosition ? 'auto' : 'manual'

    geoPositionSelect.addEventListener('change', (e:any)=> {
      setWidgetsSetting('autoGeoPosition', e.target.value === 'auto')
      manualGeoPositionBlock.style.display = e.target.value === 'auto' ? 'none' : 'flex'
      this.updateDate()
      this.updateWeather(true)
    })

    const geoManualCity:HTMLInputElement = element.querySelector('input[name="city"]')
    geoManualCity.value = settings.geoManual?.name ?? ''
    const geoManualLat:HTMLInputElement = element.querySelector('input[name="lat"]')
    geoManualLat.value = settings.geoManual?.lat+'' ?? ''
    const geoManualLon:HTMLInputElement = element.querySelector('input[name="lon"]')
    geoManualLon.value = settings.geoManual?.lon+'' ?? ''

    geoManualCity?.addEventListener('change', (e:any)=> {
      setWidgetsSetting('geoManual', {name: e.target.value, lat: geoManualLat.value, lon: geoManualLon.value})
      this.updateDate()
      this.updateWeather(true)
    })

    geoManualLat?.addEventListener('change', (e:any)=> {
      setWidgetsSetting('geoManual', {name: geoManualCity.value, lat: e.target.value, lon: geoManualLon.value})
      this.updateDate()
      this.updateWeather(true)
    })

    geoManualLon?.addEventListener('change', (e:any)=> {
      setWidgetsSetting('geoManual', {name: geoManualCity.value, lat: geoManualLat.value, lon: e.target.value})
      this.updateDate()
      this.updateWeather(true)
    })

    return element
  }

  async getGeoPosition() {
    if(this.#widgetsSettings.geoInfo){
      return this.#widgetsSettings.geoInfo
    }

    try {
      const location = await fetch('http://ip-api.com/json/').then((response) => response.json() )
      this.#widgetsSettings.geoInfo = location
      setWidgetsSetting('geoInfo', location)
      return location
    } catch (error) {
      console.error('Error getting location:', error)
    }
  }
  
  async getWeatherData(force = false) {
    const settings = getWidgetsSettings()

    const location = settings.autoGeoPosition ? await this.getGeoPosition() : settings.geoManual
    if(!location || !(location.lat && location.lon)) return

    /*location = {
      ...location,
      lat: 31.75871290706921,
      lon: 35.20813346146496
    }*/
    const forecast = getStorageItem('dev-widgets-weather-forecast')
    if(forecast && !force){
      return JSON.parse(forecast)
    }
    try {
      const apiBaseURL = 'https://api.open-meteo.com/v1/forecast'
      const apiURL = `${apiBaseURL}?latitude=${location.lat}&longitude=${location.lon}&daily=weather_code,temperature_2m_min,temperature_2m_max,rain_sum,showers_sum,snowfall_sum&hourly=weather_code,rain,showers,snowfall,snow_depth,temperature_2m&current=temperature_2m,rain,showers,weather_code,is_day,snowfall&timeformat=unixtime&timezone=auto&`
      const response = await fetch(apiURL)
      const data = await response.json()
      setStorageItem('dev-widgets-weather-forecast', JSON.stringify(data))
      return data
    } catch (error) {
      console.log('Error fetching weather data:', error)
    }
  }

  updateDate() {
    const settings = getWidgetsSettings()
    if(!settings.weather.active) return

    const now = new Date()
    const day = now.toLocaleDateString('en-US', { weekday: 'long' })
    const date = now.toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' })
    this.#date.innerHTML = `${date} <span>${day}</span>`

    if(settings.autoGeoPosition && settings.geoInfo) {
      this.#country.textContent = `${settings.geoInfo.countryCode}, ${settings.geoInfo.city}`
    } else {
      this.#country.textContent = settings.geoManual?.name ?? '-'
    }
  }
  
  async updateWeather(force = false) {
    const settings = getWidgetsSettings()
    if(!settings.weather.active) return

    const data = await this.getWeatherData(force)
    if(!data || !data.current) {
      this.#temp.textContent = ''
      this.#weatherDescription.textContent = ''
      this.#weatherIcon.innerHTML = ''
      return
    }

    const { current } = data
    this.#temp.textContent = `${Math.round(current.temperature_2m) ?? '-'}°`

    const weatherCondition = WEATHER_DATA.find(data => data.code.includes(current.weather_code))
    if(weatherCondition){
      const icon = WEATHER_ICONS[`${weatherCondition.icon}_${current.isDay ? 'd' : 'n'}` as keyof typeof WEATHER_ICONS]
      if(icon) {
        this.#weatherIcon.innerHTML = `<img src="${icon}" alt="${weatherCondition?.description}">`
      }
      this.#weatherDescription.textContent = weatherCondition.description ?? '-'
    }
  }


  async updateWeatherDaily() {
    const parent = document.getElementById('daily-weather-widget')
    if(!parent) return

    const settings = getWidgetsSettings()
    if(!settings.dailyWeather.active) return

    const weatherData = await this.getWeatherData()
    if(!weatherData || !weatherData.daily) return
    const { daily } = weatherData

    let daysHtml = ''
    daily.time.forEach((time:number, index:number) => {
      daysHtml += weeklyWeatherDay({
        time,
        min: daily.temperature_2m_min[index],
        max: daily.temperature_2m_max[index],
        code: daily.weather_code[index]
      })
    })

    parent.querySelector('.container').innerHTML = daysHtml
  }

  timeListener(e:any){
    const time = e.target.value.split(':')
    const hour = time[0]
    const minutes = parseInt(time[1], 10)
    // Update weather every 3 hour
    if(hour % 3 === 0){
      this.updateWeather(true)
    }
    // Update date every day
    if(hour === 0) {
      this.updateDate()
    }
  }

  dailyTimeListener(e:any) {
    const time = e.target.value.split(':')
    const hour = time[0]
    const minutes = parseInt(time[1], 10)
    // Update weekly weather every 3 hour
    if(hour % 3 === 0){
      this.updateWeatherDaily()
    }
  }

  toggleWeather(show = true) {
    document.getElementById('weather-widget').style.display = show ? 'block' : 'none'
  }

  toggledailyWeather(show = true) {
    document.getElementById('daily-weather-widget').style.display = show ? 'block' : 'none'
  }

}

export type { WeatherController }
const weatherController = WeatherController.getInstance()
export default weatherController