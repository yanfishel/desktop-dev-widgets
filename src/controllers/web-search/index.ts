import {SEARCH_ENGINES, STORAGE_KEYS} from "@constants";
import {getStorageItem, setStorageItem, getWidgetsSettings, setWidgetsWidgetSetting} from "@utils";
import {settingsMenuWebSearchHtml, webSearchHtml} from "./html";

import './style.css'



class WebSearch {
  static instance: WebSearch | null = null

  #id: string
  #searchInput: HTMLInputElement
  #searchIngineSelect: HTMLSelectElement
  #searchIngineIcon: HTMLImageElement


  static getInstance() {
    if (!WebSearch.instance) {
      WebSearch.instance = new WebSearch()
    }
    return WebSearch.instance
  }

  public build(container: HTMLElement){
    const settings = getWidgetsSettings()
    this.#id = settings.widgets.webSearch.id
    const elem = document.createElement('div')
    elem.id = this.#id
    elem.innerHTML = webSearchHtml
    elem.style.order = settings.widgets.webSearch.order.toString()
    elem.style.display = settings.widgets.webSearch.active ? 'block' : 'none'

    this.#searchInput = elem.querySelector('input[name="web-search-input"]')
    this.#searchIngineSelect = elem.querySelector('select[name="web-search-engine"]')
    this.#searchIngineIcon = elem.querySelector('.search-engine-icon')

    const storedEngine = getStorageItem(STORAGE_KEYS.WIDGET_SEARCH_ENGINE)
    if(storedEngine) {
      const engine = SEARCH_ENGINES.find(engine => engine.name === storedEngine)
      if(engine) {
        this.#searchIngineIcon.src = engine.icon
        this.#searchIngineSelect.value = engine.name
      }
    }

    this.#searchIngineSelect.addEventListener('change', (e:any)=> {
      const engine = SEARCH_ENGINES.find(engine => engine.name === e.target.value)
      if(engine) {
        this.#searchIngineIcon.src = engine.icon
        setStorageItem(STORAGE_KEYS.WIDGET_SEARCH_ENGINE, engine.name)
      }
    })

    this.#searchInput.addEventListener('keydown', (e:any)=> {
      if(e.key === 'Enter') {
        this.search()
      }
    })

    container.appendChild(elem)
  }

  public settingsMenuElement(){
    const settings = getWidgetsSettings()

    const element = document.createElement('div')
    element.classList.add('settings-menu-item')
    element.innerHTML = settingsMenuWebSearchHtml

    const checkBox:HTMLInputElement = element.querySelector('input[type="checkbox"]')
    checkBox.checked = settings.widgets.webSearch.active
    checkBox.addEventListener('change', (e:any)=> {
      document.getElementById(settings.widgets.webSearch.id).style.display = e.target.checked ? 'block' : 'none'
      setWidgetsWidgetSetting('webSearch', {...settings.widgets.webSearch, active: e.target.checked })
    })

    return element
  }

  private search(){
    const query = this.#searchInput.value.trim()
    if(!query) return
    const engine = SEARCH_ENGINES.find(engine => engine.name === this.#searchIngineSelect.value)
    if(engine) {
      this.#searchInput.value = ''
      const url = engine.link + encodeURIComponent(query)
      window.electronAPI.openExternal(url)
    }
  }


}

export type { WebSearch }
const webSearchController = WebSearch.getInstance()
export default webSearchController