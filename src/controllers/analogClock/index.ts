import {getWidgetsSettings, setWidgetsSetting} from "../../utils/widgetsSettings";
import {analogClockHtml} from "./html";
import "./style.css"

class AnalogClockController {
  static instance: AnalogClockController | null = null

  #widgetsSettings:IWidgetsSettings

  #hourhand: HTMLElement
  #minutehand: HTMLElement
  #secondhand: HTMLElement
  #date: HTMLElement

  #globalTimeInput: HTMLInputElement

  constructor() {
    const settings = getWidgetsSettings()
    this.#widgetsSettings = settings
  }


  static getInstance() {
    if (!AnalogClockController.instance) {
      AnalogClockController.instance = new AnalogClockController()
    }

    return AnalogClockController.instance
  }

  build(container: HTMLElement ) {

    const elem = document.createElement('div')
    elem.id = 'analog-clock'
    elem.innerHTML = analogClockHtml
    container.appendChild(elem)

    this.#hourhand = elem.querySelector('.hourhand')
    this.#minutehand = elem.querySelector('.minutehand')
    this.#secondhand = elem.querySelector('.secondhand')
    this.#date = elem.querySelector('.date')

    this.#globalTimeInput = document.getElementById('global-time') as HTMLInputElement

    this.update()
  }

  settingsMenuElement() {
    if(!this.#widgetsSettings){
      this.#widgetsSettings = getWidgetsSettings()
    }
    const element = document.createElement('div')
    element.classList.add('settings-menu-item')

    return element
  }


  private update(){
    const now = new Date() // Create a new Date object to get the current date and time
    const hour = now.getHours() // Get the current hour
    const minute = now.getMinutes() // Get the current minute
    const second = now.getSeconds() // Get the current second

    this.#hourhand.style.transform = `rotate(${(hour * 30) + (minute / 2) - 90}deg)`
    this.#minutehand.style.transform = `rotate(${(minute * 6) + (second / 10) - 90}deg)`
    this.#secondhand.style.transform = `rotate(${second * 6 - 90}deg)`

    const weekday = new Intl.DateTimeFormat('en-US', { weekday:'long' }).format(now)
    const date = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short' }).format(now)
    this.#date.innerHTML = `<span>${ weekday }</span>${ date }`

    if(second % 15 === 0) {
      this.#globalTimeInput.value = `${hour}:${minute}:${second}`
    }

    setTimeout(this.update.bind(this), 1000)
  }

}

export type { AnalogClockController }
const analogClockController = AnalogClockController.getInstance()
export default analogClockController