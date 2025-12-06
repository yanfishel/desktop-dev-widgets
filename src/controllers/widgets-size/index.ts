import {getWidgetsSettings, setWidgetsSetting} from "../../utils";
import {settingsMenuHtml} from "./html";


class SizeController {
  static instance: SizeController | null = null


  static getInstance() {
    if (!SizeController.instance) {
      SizeController.instance = new SizeController()
    }

    return SizeController.instance
  }

  public init(){
    const settings = getWidgetsSettings()

    document.documentElement.classList.remove("widgets-size-small", "widgets-size-medium", "widgets-size-large")
    document.documentElement.classList.add(`widgets-size-${settings.size ?? 'large'}`)
  }

  public settingsMenuElement() {
    const settings = getWidgetsSettings()

    const element = document.createElement('div')
    element.classList.add('settings-menu-item')
    element.innerHTML = settingsMenuHtml

    // Add event listener to select element
    const select = element.querySelector('select')
    select.value = settings.size ?? 'large'

    select.addEventListener('change', (e)=> {
      const value = (e.target as HTMLInputElement).value as TWidgetsSize
      document.documentElement.classList.remove("widgets-size-small", "widgets-size-medium", "widgets-size-large")
      document.documentElement.classList.add(`widgets-size-${value}`)
      window.electronAPI.setWidgetsSize(value)
      settings.size = value
      setWidgetsSetting('size', value)
    })

    element.appendChild(select)

    return element
  }

  public setWidgetsSize(size:TWidgetsSize){
    document.documentElement.classList.remove("widgets-size-small", "widgets-size-medium", "widgets-size-large")
    document.documentElement.classList.add(`widgets-size-${size}`)
    setWidgetsSetting('size', size);
    (document.querySelector('select[name="widgets-size"]') as HTMLSelectElement).value = size
  }

}

export type { SizeController }
const sizeController = SizeController.getInstance()
export default sizeController