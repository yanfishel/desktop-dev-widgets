import {getWidgetsSettings} from "../../utils/widgetsSettings";
import lockPositionController from "../lockPosition";
import themeController from "../theme";
import {settingsContainerHtml} from "./html";

import "./style.css"


class SettingsMenuController {
  static instance: SettingsMenuController | null = null

  #widgetsSettings:IWidgetsSettings

  #settingsContainer: HTMLElement
  #openButton: HTMLElement
  #closeButton: HTMLElement
  #settingsMenu: HTMLElement

  constructor() {
    const settings = getWidgetsSettings()
    this.#widgetsSettings = settings
  }


  static getInstance() {
    if (!SettingsMenuController.instance) {
      SettingsMenuController.instance = new SettingsMenuController()
    }

    return SettingsMenuController.instance
  }


  build(container: HTMLElement) {
    this.#settingsContainer = document.createElement('div')
    this.#settingsContainer.id = 'settings-container'
    this.#settingsContainer.innerHTML = settingsContainerHtml

    this.#openButton = this.#settingsContainer.querySelector('.settings-menu-open')
    this.#closeButton = this.#settingsContainer.querySelector('.settings-menu-close')
    this.#settingsMenu = this.#settingsContainer.querySelector('.settings-menu')

    this.listeners()

    // Collect Menu items
    // Lock Position Item
    const itemRowLock = lockPositionController.settingsMenuElement()
    this.#settingsMenu.appendChild( itemRowLock )
    // Theme Item
    const itemRowTheme = themeController.settingsMenuElement()
    this.#settingsMenu.appendChild( itemRowTheme )

    container.appendChild( this.#settingsContainer )
  }

  listeners() {
    // Add event listeners
    this.#openButton.addEventListener('click', () => {
      this.#settingsMenu.style.display = 'block'
    })

    this.#closeButton.addEventListener('click', () => {
      this.#settingsMenu.style.display = 'none'
    })
  }


}

export type { SettingsMenuController }
const settingsMenuController = SettingsMenuController.getInstance()
export default settingsMenuController