import {getStorageItem, getWidgetsSettings, setStorageItem, setWidgetsSetting} from "../../utils";
import {WEATHER_DATA} from "../../constans";
import Toast from "../../shared/toast";
import {WEATHER_ICONS} from "../../assets";
import {dailyWeatherHtml, dayWeatherHtml, settingsMenuWeatherHtml, weeklyWeatherDay} from "./html";

import "./style.css"


class WeatherController {
  static instance: WeatherController | null = null

  #widgetsSettings:IWidgetsSettings

  #globalTimeinput: HTMLInputElement

  #date: HTMLElement
  #country: HTMLElement
  #temp: HTMLElement
  #weatherIcon: HTMLElement
  #weatherDescription: HTMLElement
  #toast: Toast


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
    this.#globalTimeinput.addEventListener('change', this.timeListener)

    await this.updateDate()

    await this.updateWeather()

    container.appendChild(elem)
  }

  buildDaily(container: HTMLElement){
    const settings = getWidgetsSettings()

    const elem = document.createElement('div')
    elem.id = 'daily-weather-widget'
    elem.style.order = settings.dailyWeather?.order?.toString() ?? undefined
    elem.style.display = settings.dailyWeather.active ? 'block' : 'none'
    elem.innerHTML = dailyWeatherHtml

    container.appendChild(elem)

    this.#toast = new Toast(elem)

    this.#globalTimeinput.addEventListener('change', this.dailyTimeListener)
    this.updateWeatherDaily()
  }

  settingsMenuElement() {
    const element = document.createElement('span')
    element.innerHTML = settingsMenuWeatherHtml

    const settings = getWidgetsSettings()

    // Current weather visible Checkbox
    const weatherCheckbox:HTMLInputElement = element.querySelector('input[name="weather-active"]')
    weatherCheckbox.checked = settings.weather.active
    weatherCheckbox.addEventListener('change', (e:any)=> {
      setWidgetsSetting('weather', {active: e.target.checked})
      this.toggleWeather(e.target.checked)
    })
    // Daily weather visible Checkbox
    const dailyWeatherCheckbox:HTMLInputElement = element.querySelector('input[name="daily-weather-active"]')
    dailyWeatherCheckbox.checked = settings.dailyWeather.active
    dailyWeatherCheckbox.addEventListener('change', (e:any)=> {
      setWidgetsSetting('dailyWeather', {...settings.dailyWeather, active: e.target.checked })
      this.toggledailyWeather(e.target.checked)
    })

    // Geolocation Auto/Manual settings
    const manualGeoPositionBlock:HTMLElement = element.querySelector('.geo-position-manual')
    manualGeoPositionBlock.style.display = settings.autoGeoPosition ? 'none' : 'flex'
    const geoPositionSelect:HTMLSelectElement = element.querySelector('select[name="geo-position"]')
    geoPositionSelect.value = settings.autoGeoPosition ? 'auto' : 'manual'

    geoPositionSelect.addEventListener('change', (e:any)=> {
      setWidgetsSetting('autoGeoPosition', e.target.value === 'auto')
      manualGeoPositionBlock.style.display = e.target.value === 'auto' ? 'none' : 'flex'
      this.updateAll()
    })

    const geoManualCity:HTMLInputElement = element.querySelector('input[name="city"]')
    geoManualCity.value = settings.location?.name ?? ''
    const geoManualLat:HTMLInputElement = element.querySelector('input[name="lat"]')
    geoManualLat.value = settings.location?.lat+'' ?? ''
    const geoManualLon:HTMLInputElement = element.querySelector('input[name="lon"]')
    geoManualLon.value = settings.location?.lon+'' ?? ''

    geoManualCity?.addEventListener('change', (e:any)=> {
      setWidgetsSetting('location', {name: e.target.value, lat: geoManualLat.value, lon: geoManualLon.value})
      this.updateAll()
    })

    geoManualLat?.addEventListener('change', (e:any)=> {
      setWidgetsSetting('location', {name: geoManualCity.value, lat: e.target.value, lon: geoManualLon.value})
      this.updateAll()
    })

    geoManualLon?.addEventListener('change', (e:any)=> {
      setWidgetsSetting('location', {name: geoManualCity.value, lat: geoManualLat.value, lon: e.target.value})
      this.updateAll()
    })

    return element
  }

  async getGeoPosition() {
    const settings = getWidgetsSettings()
    if(!settings.autoGeoPosition) {
      return settings.location
    }

    const location = getStorageItem('dev-widgets-geo-location')
    if(location){
      const parsed = JSON.parse(location)
      if(parsed.timestamp + (30 * 60) > new Date().getSeconds()){
        return parsed
      }
    }
    try {
      const location = await fetch('http://ip-api.com/json/').then((response) => response.json() )
      if(location){
        const data = {
          ...location,
          timestamp: new Date().getSeconds()
        }
        setStorageItem('dev-widgets-geo-location', JSON.stringify(data))
        return data
      }
    } catch (error) {
      console.error('Error getting location:', error)
    }
  }
  
  async getWeatherData() {
    if(this.#toast){
      await this.#toast.hide()
    }
    const location = await this.getGeoPosition()
    if(!location || !(location.lat*1 && location.lon*1)) {
      if(this.#toast) {
        this.#toast.error('Error getting Location.', 'infinity', true)
      }
      return
    }
    /*location = {
      ...location,
      lat: 31.75871290706921,
      lon: 35.20813346146496
    }*/
    const forecast = getStorageItem('dev-widgets-weather-forecast')
    if(forecast){
      const data = JSON.parse(forecast)
      if(data.timestamp + (30 * 60) < new Date().getSeconds() && data.lat === location.lat && data.lon === location.lon){
        return data
      }
    }
    try {
      const apiBaseURL = 'https://api.open-meteo.com/v1/forecast'
      const urlLocation = `latitude=${location.lat}&longitude=${location.lon}`
      const urlCurrent = 'current=temperature_2m,rain,showers,weather_code,is_day,snowfall'
      const urlHourly = 'hourly=weather_code,rain,showers,snowfall,snow_depth,temperature_2m'
      const urlDaily = 'daily=weather_code,temperature_2m_min,temperature_2m_max'
      const apiURL = `${ apiBaseURL }?${ urlLocation }&${ urlCurrent }&${ urlHourly }&${ urlDaily }&timeformat=unixtime&timezone=auto`
      const response = await fetch(apiURL)
      const responseJson = await response.json()
      const data = {
        ...responseJson,
        timestamp: new Date().getSeconds(),
        lat: location.lat,
        lon: location.lon
      }
      setStorageItem('dev-widgets-weather-forecast', JSON.stringify(data))
      return data
    } catch (error) {
      if(this.#toast) {
        this.#toast.error('Error fetching weather data.', 'infinity', true)
      }
      console.log('Error fetching weather data:', error)
    }
  }

  async updateDate() {
    const settings = getWidgetsSettings()
    if(!settings.weather.active) return

    const now = new Date()
    const day = now.toLocaleDateString('en-US', { weekday: 'long' })
    const date = now.toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' })
    this.#date.innerHTML = `${date} <span>${day}</span>`

    if(settings.autoGeoPosition) {
      const location = await this.getGeoPosition()
      this.#country.textContent = `${location?.countryCode ?? '-'}, ${location?.city ?? '-'}`
    } else {
      this.#country.textContent = settings.location?.name ?? '-'
    }
  }
  
  async updateWeather() {
    const settings = getWidgetsSettings()
    if(!settings.weather.active) return

    const data = await this.getWeatherData()
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
    if(this.#toast){
      await this.#toast.hide()
    }
    parent.querySelector('.container').innerHTML = ''

    const settings = getWidgetsSettings()
    if(!settings.dailyWeather.active) return

    const weatherData = await this.getWeatherData()
    if(!weatherData || !weatherData.daily) {
      return
    }

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

  async updateAll(){
    await this.updateDate()
    await this.updateWeather()
    await this.updateWeatherDaily()
  }

  timeListener(e:any){
    const time = e.target.value.split(':')
    const hour = time[0]
    const minutes = parseInt(time[1], 10)
    // Update weather every hour
    if(minutes === 0){
      this.updateWeather()
      // Update date every day
      if(hour === 0) {
        this.updateDate()
      }
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