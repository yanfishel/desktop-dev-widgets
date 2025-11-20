import lockPositionController from "../lock-position";
import sizeController from "../widgets-size";
import themeController from "../theme";
import weatherController from "../weather";
import {settingsContainerHtml} from "./html";

import "./style.css"
import webSearchController from "../web-search";
import notesController from "../notes";
import devUtilsController from "../dev-utils";


class SettingsMenuController {
  static instance: SettingsMenuController | null = null

  #settingsContainer: HTMLElement
  #openButton: HTMLElement
  #closeButton: HTMLElement
  #settingsMenu: HTMLElement

  static getInstance() {
    if (!SettingsMenuController.instance) {
      SettingsMenuController.instance = new SettingsMenuController()
    }

    return SettingsMenuController.instance
  }


  public build(container: HTMLElement) {
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
    // Size Item
    const itemRowSize = sizeController.settingsMenuElement()
    this.#settingsMenu.appendChild( itemRowSize )
    // Theme Item
    const itemRowTheme = themeController.settingsMenuElement()
    this.#settingsMenu.appendChild( itemRowTheme )
    // Weather Item
    const itemRowWeather = weatherController.settingsMenuElement()
    this.#settingsMenu.appendChild( itemRowWeather )

    // Title
    const widgetsTitle = document.createElement('h1')
    widgetsTitle.textContent = 'Widgets'
    this.#settingsMenu.appendChild( widgetsTitle )

    // Sortable Settings Items
    const sortable = document.createElement('div')
    sortable.classList.add('sortable-container')

    // Weather Daily Item
    const itemRowWeatherDaily = weatherController.settingsMenuElementDaily()
    sortable.appendChild( itemRowWeatherDaily )
    // Web Search Item
    const itemRowSearch = webSearchController.settingsMenuElement()
    sortable.appendChild( itemRowSearch )
    // Dev Utils Item
    const itemRowDevUtils = devUtilsController.settingsMenuElement()
    sortable.appendChild( itemRowDevUtils )
    // Item Notes
    const itemRowNotes = notesController.settingsMenuElement()
    sortable.appendChild( itemRowNotes )

    this.#settingsMenu.appendChild( sortable )
    // ./ End Sortable Settings Items

    container.appendChild( this.#settingsContainer )
  }

  private listeners() {
    // Add event listeners
    this.#openButton.addEventListener('click', () => {
      this.#settingsMenu.style.display = 'block'
    })

    this.#closeButton.addEventListener('click', () => {
      this.#settingsMenu.style.display = 'none'
    })

    document.addEventListener('click', (e:any) => {
      if ( !this.#settingsMenu.contains(e.target)
        && e.target !== this.#settingsMenu
        && !this.#openButton.contains(e.target)
        && e.target !== this.#openButton ) {
        this.#settingsMenu.style.display = 'none'
      }
    })

  }


}

export type { SettingsMenuController }
const settingsMenuController = SettingsMenuController.getInstance()
export default settingsMenuController