import {getStorageItem, getWidgetsSettings, setStorageItem, setWidgetsSetting} from "../../utils";
import dateTimeTabController from "./date-time";
import encodeTabController from "./encode";
import rubberDuckTabController from "./rubber-duck";
import {devUtilsHtml, settingsMenuDevUtilsHtml} from "./html";

import "./style.css"
import colorController from "./color";

class DevUtils {
  static instance: DevUtils | null = null


  static getInstance() {
    if (!DevUtils.instance) {
      DevUtils.instance = new DevUtils()
    }
    return DevUtils.instance
  }

  public build(container: HTMLElement){
    const settings = getWidgetsSettings()

    const elem = document.createElement('div')
    elem.id = 'dev-utils-widget'
    elem.style.order = settings.devUtils.order+''
    elem.style.display = settings.devUtils.active ? 'block' : 'none'

    elem.innerHTML = devUtilsHtml
    
    const tabsContent:HTMLElement = elem.querySelector('.content')
    encodeTabController.build(tabsContent)
    dateTimeTabController.build(tabsContent)
    colorController.build(tabsContent)
    rubberDuckTabController.build(tabsContent)

    // TABS CONTROL
    const activeTab = getStorageItem('dev-utils-active-tab') ?? 'encode'
    dateTimeTabController.toggleActive(settings.devUtils.active && activeTab === 'datetime')
    const tabControl = elem.querySelectorAll('input[name="tab-control"]')
    tabControl.forEach((tab:HTMLInputElement, idx) =>{
      if(activeTab) tab.checked = activeTab === tab.dataset.tab
      else tab.checked = idx === 0
      tab.addEventListener('change', (e:any)=> {
        const tabActive = e.target.dataset.tab
        dateTimeTabController.toggleActive(tabActive === 'datetime')
        setStorageItem('dev-utils-active-tab', tabActive)
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
    checkBox.checked = settings.devUtils.active

    checkBox.addEventListener('change', (e:any)=> {
      document.getElementById('dev-utils-widget').style.display = e.target.checked ? 'block' : 'none'
      dateTimeTabController.toggleActive(e.target.checked)
      setWidgetsSetting('devUtils', {...settings.devUtils, active:e.target.checked})
    })

    return element
  }

  public update(){
    dateTimeTabController.toggleActive(true)
  }

}

export type { DevUtils }
const devUtilsController = DevUtils.getInstance()
export default devUtilsController