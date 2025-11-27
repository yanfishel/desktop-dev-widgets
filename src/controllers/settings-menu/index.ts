import Sortable from 'sortablejs';

import {getWidgetsSettings, setWidgetsSetting} from "../../utils";
import lockPositionController from "../../controllers/lock-position";
import sizeController from "../../controllers/widgets-size";
import themeController from "../../controllers/theme";
import weatherController from "../../controllers/weather";
import webSearchController from "../../controllers/web-search";
import notesController from "../../controllers/notes";
import devUtilsController from "../../controllers/dev-utils";
import systemInfoController from "../../controllers/system-info";

import {settingsContainerHtml, settingsFooterHtml, settingsMenuFooterHtml} from "./html";
import "./style.css"


class SettingsMenuController {
  static instance: SettingsMenuController | null = null

  #settingsContainer: HTMLElement
  #openButton: HTMLElement
  #closeButton: HTMLElement
  #settingsMenu: HTMLElement
  #sortable: Sortable
  #menuFooter: HTMLElement

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

    const settings = getWidgetsSettings()

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
    itemRowWeatherDaily.dataset.widget = settings.widgets.dailyWeather.id
    itemRowWeatherDaily.style.order = settings.widgets.dailyWeather.order.toString()
    sortable.appendChild( itemRowWeatherDaily )

    // Web Search Item
    const itemRowSearch = webSearchController.settingsMenuElement()
    itemRowSearch.dataset.widget = settings.widgets.webSearch.id
    itemRowSearch.style.order = settings.widgets.webSearch.order.toString()
    sortable.appendChild( itemRowSearch )

    // Systeminformation Item
    const itemRowSisteminfo = systemInfoController.settingsMenuElement()
    itemRowSisteminfo.dataset.widget = settings.widgets.systemInfo.id
    itemRowSisteminfo.style.order = settings.widgets.systemInfo.order.toString()
    sortable.appendChild( itemRowSisteminfo )

    // Dev Utils Item
    const itemRowDevUtils = devUtilsController.settingsMenuElement()
    itemRowDevUtils.dataset.widget = settings.widgets.devUtils.id
    itemRowDevUtils.style.order = settings.widgets.devUtils.order.toString()
    sortable.appendChild( itemRowDevUtils )

    // Item Notes
    const itemRowNotes = notesController.settingsMenuElement()
    itemRowNotes.dataset.widget = settings.widgets.notes.id
    itemRowNotes.style.order = settings.widgets.notes.order.toString()
    sortable.appendChild( itemRowNotes )


    this.#settingsMenu.appendChild( sortable )
    // ./ End Sortable Settings Items

    // Footer
    this.#menuFooter = document.createElement('div')
    this.#menuFooter.classList.add('settings-menu-footer')
    this.#menuFooter.innerHTML = settingsFooterHtml
    const link = this.#menuFooter.querySelector('a')
    link.addEventListener('click', () => window.electronAPI.openAboutWinow())
    this.#settingsMenu.appendChild( this.#menuFooter )

    container.appendChild( this.#settingsContainer )

    // Sort element && init Draggeble Sorting
    this.#sortable = Sortable.create(sortable, {
      direction: 'vertical',
      handle: '.menu-item-handle',
      ghostClass: 'menu-item-ghost',
      dataIdAttr: 'data-widget',
      onEnd: (evt:any) => {
        const sorted = this.#sortable.toArray()
        const settings = getWidgetsSettings()
        sorted.forEach((id, index) => {
          Object.keys(settings.widgets).forEach((key: keyof TWidgets) => {
            if(settings.widgets[key].id === id) {
              settings.widgets[key].order = index + 1
              document.getElementById(id).style.order = (index + 1).toString()
            }
          })
        })
        setWidgetsSetting('widgets', settings.widgets)
      }
    })
    const sortedArray:any[] = []
    Object.keys(settings.widgets).forEach((key:keyof TWidgets) => {
      sortedArray[ settings.widgets[key].order-1 ] = settings.widgets[key].id
    })

    this.#sortable.sort(sortedArray);

    //this.getAppInfo()
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

  private async getAppInfo(){
    const {packageJson, versions} = await window.electronAPI.getAppInfo()
    console.log(packageJson);
    if(!packageJson) return

    const html = settingsMenuFooterHtml(packageJson)

    this.#menuFooter.innerHTML = html

  }

}

export type { SettingsMenuController }
const settingsMenuController = SettingsMenuController.getInstance()
export default settingsMenuController