import {getWidgetsSettings, setWidgetsSetting} from "../../utils/widgetsSettings";
import {settingsMenuLockPositionHtml} from "./html";

class LockPositionController {
  static instance: LockPositionController | null = null

  #widgetsSettings:IWidgetsSettings

  constructor() {
    const settings = getWidgetsSettings()
    this.#widgetsSettings = settings
  }


  static getInstance() {
    if (!LockPositionController.instance) {
      LockPositionController.instance = new LockPositionController()
    }

    return LockPositionController.instance
  }


  init() {
    // DRAGGABLE ICON IF NOT LOCKEDs
    if(!this.#widgetsSettings.locked){
      document.getElementById('drag-icon').style.display = 'block'
    }
  }


  settingsMenuElement() {
    const settings = getWidgetsSettings()

    const element = document.createElement('div')
    element.classList.add('settings-menu-item')
    element.innerHTML = settingsMenuLockPositionHtml

    const lockCheckbox:HTMLInputElement = element.querySelector('input[type="checkbox"]')
    lockCheckbox.checked = settings.locked

    lockCheckbox.addEventListener('change', (e:any)=> {
      document.getElementById('drag-icon').style.display = e.target.checked ? 'none' : 'block'
      setWidgetsSetting('locked', e.target.checked)
    })

    return element
  }


}

export type { LockPositionController }
const lockPositionController = LockPositionController.getInstance()
export default lockPositionController