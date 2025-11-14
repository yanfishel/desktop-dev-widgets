import {getWidgetsSettings, setWidgetsSetting} from "../../utils/widgetsSettings";
import {settingsMenuHtml} from "./html";


class ThemeController {
  static instance: ThemeController | null = null

  #widgetsSettings:IWidgetsSettings

  constructor() {
    const settings = getWidgetsSettings()
    this.#widgetsSettings = settings
  }


  static getInstance() {
    if (!ThemeController.instance) {
      ThemeController.instance = new ThemeController()
    }

    return ThemeController.instance
  }

  init() {
    

    // Set initial theme && Listen for system theme changes
    const systemDarkTheme = window.matchMedia("(prefers-color-scheme: dark)")
    systemDarkTheme.addEventListener("change", (e)=>this.setSystemTheme(e.matches))
    if(this.#widgetsSettings.theme === 'system') {
      this.setDarkTheme(systemDarkTheme.matches);
    } else {
      this.setDarkTheme(this.#widgetsSettings.theme === 'dark')
    }
  }

  settingsMenuElement() {
    if(!this.#widgetsSettings){
      this.#widgetsSettings = getWidgetsSettings()
    }
    const element = document.createElement('div')
    element.classList.add('settings-menu-item')
    element.innerHTML = settingsMenuHtml

    // Add event listener to select element
    const select = element.querySelector('select')
    select.value = this.#widgetsSettings.theme ?? 'system'
    select.addEventListener('change', (e:any)=> this.changeTheme(e.target.value))

    element.appendChild(select)

    return element
  }


  private changeTheme(theme:string){
    if(theme === 'system'){
      this.systemTheme()
    } else {
      this.setDarkTheme(theme === 'dark')
    }
    this.#widgetsSettings = setWidgetsSetting('theme', theme)
  }

  private systemTheme(){
    const systemDarkTheme = window.matchMedia("(prefers-color-scheme: dark)");
    this.setDarkTheme(systemDarkTheme.matches);
  }

  private setSystemTheme(match:boolean){
    const settings = getWidgetsSettings()
    if(settings.theme !== 'system') {
      return
    }
    this.setDarkTheme(match)
  }

  private setDarkTheme(set:boolean){
    document.documentElement.className = set ? "theme-dark" : '';
  }

}

export type { ThemeController }
const themeController = ThemeController.getInstance()
export default themeController