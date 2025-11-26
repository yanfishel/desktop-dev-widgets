import {STORAGE_KEYS} from "../../constants";
import {getStorageItem, setStorageItem, getWidgetsSettings, setWidgetsWidgetSetting} from "../../utils";
import dateTimeTabController from "./date-time";
import encodeTabController from "./encode";
import colorController from "./color";
import rubberDuckTabController from "./rubber-duck";
import {devUtilsHtml, settingsMenuDevUtilsHtml} from "./html";

import "./style.css"


class DevUtils {
  static instance: DevUtils | null = null

  #id: string

  static getInstance() {
    if (!DevUtils.instance) {
      DevUtils.instance = new DevUtils()
    }
    return DevUtils.instance
  }

  public build(container: HTMLElement){
    const settings = getWidgetsSettings()
    this.#id = settings.widgets.devUtils.id
    const elem = document.createElement('div')
    elem.id = this.#id
    elem.style.order = settings.widgets.devUtils.order+''
    elem.style.display = settings.widgets.devUtils.active ? 'block' : 'none'

    elem.innerHTML = devUtilsHtml
    
    const tabsContent:HTMLElement = elem.querySelector('.content')
    encodeTabController.build(tabsContent)
    dateTimeTabController.build(tabsContent)
    colorController.build(tabsContent)
    rubberDuckTabController.build(tabsContent)

    // TABS CONTROL
    const activeTab = getStorageItem(STORAGE_KEYS.WIDGET_DEV_UTILS_TAB) ?? 'encode'
    dateTimeTabController.toggleActive(settings.widgets.devUtils.active && activeTab === 'datetime')
    const tabControl = elem.querySelectorAll('input[name="tab-control"]')
    tabControl.forEach((tab:HTMLInputElement, idx) =>{
      if(activeTab) tab.checked = activeTab === tab.dataset.tab
      else tab.checked = idx === 0
      tab.addEventListener('change', (e:any)=> {
        const tabActive = e.target.dataset.tab
        dateTimeTabController.toggleActive(tabActive === 'datetime')
        setStorageItem(STORAGE_KEYS.WIDGET_DEV_UTILS_TAB, tabActive)
      })
    })
    
    
    container.appendChild(elem)
  }

  public settingsMenuElement(){
    const settings = getWidgetsSettings()

    const element = document.createElement('div')
    element.classList.add('settings-menu-item')
    element.innerHTML = settingsMenuDevUtilsHtml

    const checkBox:HTMLInputElement = element.querySelector('input[type="checkbox"]')
    checkBox.checked = settings.widgets.devUtils.active

    checkBox.addEventListener('change', (e:any)=> {
      document.getElementById(settings.widgets.devUtils.id).style.display = e.target.checked ? 'block' : 'none'
      dateTimeTabController.toggleActive(e.target.checked)
      setWidgetsWidgetSetting('devUtils', {...settings.widgets.devUtils, active:e.target.checked})
    })

    return element
  }

  public toggleActive(){
    const settings = getWidgetsSettings()
    const activeTab = getStorageItem(STORAGE_KEYS.WIDGET_DEV_UTILS_TAB) ?? 'encode'
    dateTimeTabController.toggleActive(settings.widgets.devUtils.active && activeTab === 'datetime')
  }

}

export type { DevUtils }
const devUtilsController = DevUtils.getInstance()
export default devUtilsController