import {getWidgetsSettings, setWidgetsSetting} from "../../utils";
import {settingsMenuHtml} from "./html";


class SizeController {
  static instance: SizeController | null = null

  #widgetsSettings:IWidgetsSettings

  constructor() {
    const settings = getWidgetsSettings()
    this.#widgetsSettings = settings
  }


  static getInstance() {
    if (!SizeController.instance) {
      SizeController.instance = new SizeController()
    }

    return SizeController.instance
  }

  init(){
    if(!this.#widgetsSettings){
      this.#widgetsSettings = getWidgetsSettings()
    }
    document.documentElement.classList.remove("widgets-size-small", "widgets-size-medium", "widgets-size-large")
    document.documentElement.classList.add(`widgets-size-${this.#widgetsSettings.size ?? 'large'}`)
  }

  settingsMenuElement() {
    if(!this.#widgetsSettings){
      this.#widgetsSettings = getWidgetsSettings()
    }
    const element = document.createElement('div')
    element.classList.add('settings-menu-item')
    element.innerHTML = settingsMenuHtml

    // Add event listener to select element
    const select = element.querySelector('select')
    select.value = this.#widgetsSettings.size ?? 'large'

    select.addEventListener('change', (e:any)=> {
      document.documentElement.classList.remove("widgets-size-small", "widgets-size-medium", "widgets-size-large")
      document.documentElement.classList.add(`widgets-size-${e.target.value}`)
      window.electronAPI.setWidgetsSize(e.target.value)
      this.#widgetsSettings.size = e.target.value
      setWidgetsSetting('size', e.target.value)
    })

    element.appendChild(select)

    return element
  }

  setWidgetsSize(size:TWidgetsSize){
    document.documentElement.classList.remove("widgets-size-small", "widgets-size-medium", "widgets-size-large")
    document.documentElement.classList.add(`widgets-size-${size}`)
    this.#widgetsSettings.size = size
    setWidgetsSetting('size', size);
    (document.querySelector('select[name="widgets-size"]') as HTMLSelectElement).value = size
  }

}

export type { SizeController }
const sizeController = SizeController.getInstance()
export default sizeController