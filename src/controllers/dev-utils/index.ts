import {getStorageItem, getWidgetsSettings, setStorageItem} from "../../utils";
import rubberDuckTabController from "./rubber-duck";
import {devUtilsHtml} from "./html";

import "./style.css"
import dateTimeTabController from "./date-time";
import encodeTabController from "./encode";

class DevUtils {
  static instance: DevUtils | null = null


  static getInstance() {
    if (!DevUtils.instance) {
      DevUtils.instance = new DevUtils()
    }
    return DevUtils.instance
  }

  build(container: HTMLElement){
    const settings = getWidgetsSettings()

    const elem = document.createElement('div')
    elem.id = 'dev-utils-widget'
    elem.style.order = settings.devUtils.order+''
    elem.style.display = settings.devUtils.active ? 'block' : 'none'

    elem.innerHTML = devUtilsHtml
    
    const tabsContent:HTMLElement = elem.querySelector('.content')
    rubberDuckTabController.build(tabsContent)
    dateTimeTabController.build(tabsContent)
    encodeTabController.build(tabsContent)

    // TABS CONTROL
    const activeTab = getStorageItem('dev-utils-active-tab') ?? 'duck'
    const tabControl = elem.querySelectorAll('input[name="tab-control"]')
    tabControl.forEach((tab:HTMLInputElement, idx) =>{
      if(activeTab) tab.checked = activeTab === tab.dataset.tab
      else tab.checked = idx === 0
      tab.addEventListener('change', (e:any)=> {
        const tabActive = e.target.dataset.tab
        setStorageItem('dev-utils-active-tab', tabActive)
      })
    })
    
    
    container.appendChild(elem)
  }

}

export type { DevUtils }
const devUtilsController = DevUtils.getInstance()
export default devUtilsController