import {getWidgetsSettings, setWidgetsSetting} from "@utils";
import {settingsMenuLockPositionHtml} from "./html";

class LockPositionController {
  static instance: LockPositionController | null = null

  #lockCheckbox: HTMLInputElement

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

    this.#lockCheckbox = element.querySelector('input[type="checkbox"]')
    this.#lockCheckbox.checked = settings.locked

    this.#lockCheckbox.addEventListener('change', (e:any)=> {
      const locked = e.target.checked
      window.electronAPI.setLockPosition(locked)
      document.getElementById('drag-icon').style.display = locked ? 'none' : 'block'
      setWidgetsSetting('locked', locked)
    })

    return element
  }

  public toggleLockPosition(locked = true){
    document.getElementById('drag-icon').style.display = locked ? 'none' : 'block'
    this.#lockCheckbox.checked = locked
    setWidgetsSetting('locked', locked)
  }


}

export type { LockPositionController }
const lockPositionController = LockPositionController.getInstance()
export default lockPositionController