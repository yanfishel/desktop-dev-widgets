import {getStorageItem, getWidgetsSettings, setStorageItem, setWidgetsSetting} from "../../utils";
import {settingsMenuWebSearchHtml, webSearchHtml} from "./html";

import './style.css'
import {SEARCH_ENGINES} from "../../constans";


class WebSearch {
  static instance: WebSearch | null = null

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
    const storedEngine = getStorageItem('dev-widgets-web-search-engine')

    const elem = document.createElement('div')
    elem.id = 'web-search-widget'
    elem.innerHTML = webSearchHtml
    elem.style.order = settings.webSearch.order.toString()
    elem.style.display = settings.webSearch.active ? 'block' : 'none'

    this.#searchInput = elem.querySelector('input[name="web-search-input"]')
    this.#searchIngineSelect = elem.querySelector('select[name="web-search-engine"]')
    this.#searchIngineIcon = elem.querySelector('.search-engine-icon')

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
        setStorageItem('dev-widgets-web-search-engine', engine.name)
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
    checkBox.checked = settings.webSearch.active
    checkBox.addEventListener('change', (e:any)=> {
      document.getElementById('web-search-widget').style.display = e.target.checked ? 'block' : 'none'
      setWidgetsSetting('webSearch', {...settings.webSearch, active: e.target.checked })
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