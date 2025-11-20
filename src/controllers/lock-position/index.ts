import {getWidgetsSettings, setWidgetsSetting} from "../../utils/widgets-settings";
import {settingsMenuLockPositionHtml} from "./html";

class LockPositionController {
  static instance: LockPositionController | null = null

  static getInstance() {
    if (!LockPositionController.instance) {
      LockPositionController.instance = new LockPositionController()
    }

    return LockPositionController.instance
  }

  public init() {
    const settings = getWidgetsSettings()

    // DRAGGABLE ICON IF NOT LOCKEDs
    if(!settings.locked){
      document.getElementById('drag-icon').style.display = 'block'
    }
  }


  public settingsMenuElement() {
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