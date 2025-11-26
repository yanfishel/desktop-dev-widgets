import {getStorageItem, setStorageItem, getWidgetsSettings, setWidgetsSetting, setWidgetsWidgetSetting} from "../../utils";
import {STORAGE_KEYS, WEATHER_DATA} from "../../constants";
import {WEATHER_ICONS} from "../../assets";
import Toast from "../../controllers/toast";
import {dailyWeatherHtml, dayWeatherHtml, settingsMenuDailyWeatherHtml, settingsMenuWeatherHtml, weeklyWeatherDay} from "./html";

import "./style.css"


class WeatherController {
  static instance: WeatherController | null = null

  #dataLifetime = 30 * 60 * 1000

  #globalTimeinput: HTMLInputElement
  #toast: Toast
  #id: string
  #dailyId: string
  #date: HTMLElement
  #country: HTMLElement
  #temp: HTMLElement
  #weatherIcon: HTMLElement
  #weatherDescription: HTMLElement


  static getInstance() {
    if (!WeatherController.instance) {
      WeatherController.instance = new WeatherController()
    }

    return WeatherController.instance
  }

  public async build(container: HTMLElement) {
    const settings = getWidgetsSettings()
    this.#id = settings.weather.id
    const elem = document.createElement('div')
    elem.id = this.#id
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

  public buildDaily(container: HTMLElement){
    const settings = getWidgetsSettings()
    this.#dailyId = settings.widgets.dailyWeather.id
    const elem = document.createElement('div')
    elem.id = this.#dailyId
    elem.style.order = settings.widgets.dailyWeather?.order?.toString() ?? undefined
    elem.style.display = settings.widgets.dailyWeather.active ? 'block' : 'none'
    elem.innerHTML = dailyWeatherHtml

    container.appendChild(elem)

    this.#toast = new Toast(elem)

    this.#globalTimeinput.addEventListener('change', this.dailyTimeListener)
    this.updateWeatherDaily()
  }

  public settingsMenuElement() {
    const element = document.createElement('span')
    element.innerHTML = settingsMenuWeatherHtml

    const settings = getWidgetsSettings()

    // Current weather visible Checkbox
    const weatherCheckbox:HTMLInputElement = element.querySelector('input[name="weather-active"]')
    weatherCheckbox.checked = settings.weather.active
    weatherCheckbox.addEventListener('change', (e:any)=> {
      setWidgetsSetting('weather', {...settings.weather, active: e.target.checked})
      this.toggleWeather(e.target.checked)
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
    geoManualLat.value = settings.location?.lat.toString() ?? ''
    const geoManualLon:HTMLInputElement = element.querySelector('input[name="lon"]')
    geoManualLon.value = settings.location?.lon.toString() ?? ''

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

  public settingsMenuElementDaily() {
    const settings = getWidgetsSettings()

    const element = document.createElement('div')
    element.classList.add('settings-menu-item')
    element.innerHTML = settingsMenuDailyWeatherHtml

    // Daily weather visible Checkbox
    const dailyWeatherCheckbox:HTMLInputElement = element.querySelector('input[name="daily-weather-active"]')
    dailyWeatherCheckbox.checked = settings.widgets.dailyWeather.active

    dailyWeatherCheckbox.addEventListener('change', (e:any)=> {
      setWidgetsWidgetSetting('dailyWeather', {...settings.widgets.dailyWeather, active: e.target.checked })
      this.toggleDailyWeather(e.target.checked)
    })

    return element
  }

  private async getGeoPosition() {
    const settings = getWidgetsSettings()
    if(!settings.autoGeoPosition) {
      return settings.location
    }

    const location = getStorageItem(STORAGE_KEYS.WIDGET_WEATHER_LOCATION)
    if(location){
      const parsed = JSON.parse(location)
      if(parsed.timestamp + this.#dataLifetime > new Date().getTime()){
        return parsed
      }
    }
    try {
      const location = await fetch('http://ip-api.com/json/').then((response) => response.json() )
      if(location){
        const data = {
          ...location,
          timestamp: new Date().getTime()
        }
        setStorageItem(STORAGE_KEYS.WIDGET_WEATHER_LOCATION, JSON.stringify(data))
        return data
      }
    } catch (error) {
      console.error('Error getting location:', error)
    }
  }
  
  private async getWeatherData() {
    if(this.#toast){
      await this.#toast.hide()
    }
    const location = await this.getGeoPosition()
    if(!location || !(location.lat*1 && location.lon*1)) {
      if(this.#toast) {
        this.#toast.error({ message:'Error getting Location.', delay:'infinity', closeButton:true })
      }
      return
    }
    /*location = {
      ...location,
      lat: 31.75871290706921,
      lon: 35.20813346146496
    }*/
    const forecast = getStorageItem(STORAGE_KEYS.WIDGET_WEATHER_FORECAST)
    if(forecast){
      const data = JSON.parse(forecast)
      if( data.timestamp + this.#dataLifetime > new Date().getTime() && data.lat === location.lat && data.lon === location.lon ){
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
        timestamp: new Date().getTime(),
        lat: location.lat,
        lon: location.lon
      }
      setStorageItem(STORAGE_KEYS.WIDGET_WEATHER_FORECAST, JSON.stringify(data))
      return data
    } catch (error) {
      if(this.#toast) {
        this.#toast.error({message:'Error fetching weather data.', delay:'infinity', closeButton:true})
      }
      console.log('Error fetching weather data:', error)
    }
  }

  private async updateDate() {
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
  
  private async updateWeather() {
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
      const icon = WEATHER_ICONS[`${weatherCondition.icon}_${current.is_day ? 'd' : 'n'}` as keyof typeof WEATHER_ICONS]
      if(icon) {
        this.#weatherIcon.innerHTML = `<img src="${icon}" alt="${weatherCondition?.description}">`
      }
      this.#weatherDescription.textContent = weatherCondition.description ?? '-'
    }
  }

  private async updateWeatherDaily() {
    const settings = getWidgetsSettings()
    const parent = document.getElementById(settings.widgets.dailyWeather.id)
    if(!parent) return
    if(this.#toast){
      await this.#toast.hide()
    }
    parent.querySelector('.container').innerHTML = ''

    if(!settings.widgets.dailyWeather.active) return

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

  public async updateAll(){
    await this.updateDate()
    await this.updateWeather()
    await this.updateWeatherDaily()
  }

  private timeListener(e:any){
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

  private dailyTimeListener(e:any) {
    const time = e.target.value.split(':')
    const hour = time[0]
    const minutes = parseInt(time[1], 10)
    // Update weekly weather every 3 hour
    if(hour % 3 === 0){
      this.updateWeatherDaily()
    }
  }

  public toggleWeather(show = true) {
    const settings = getWidgetsSettings()
    document.getElementById(settings.weather.id).style.display = show ? 'block' : 'none'
    if(show) {
      this.updateWeather()
    }
  }

  public toggleDailyWeather(show = true) {
    const settings = getWidgetsSettings()
    document.getElementById(settings.widgets.dailyWeather.id).style.display = show ? 'block' : 'none'
    if(show) {
      this.updateWeatherDaily()
    }
  }

}

export type { WeatherController }
const weatherController = WeatherController.getInstance()
export default weatherController