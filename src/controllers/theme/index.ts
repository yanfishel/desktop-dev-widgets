import {getWidgetsSettings, setWidgetsSetting} from "../../utils";
import {settingsMenuHtml} from "./html";


class ThemeController {
  static instance: ThemeController | null = null

  static getInstance() {
    if (!ThemeController.instance) {
      ThemeController.instance = new ThemeController()
    }

    return ThemeController.instance
  }

  init() {
    const settings = getWidgetsSettings()

    // Set initial theme && Listen for system theme changes
    const systemDarkTheme = window.matchMedia("(prefers-color-scheme: dark)")
    systemDarkTheme.addEventListener("change", (e)=>this.setSystemTheme(e.matches))
    if(settings.theme === 'system') {
      this.setDarkTheme(systemDarkTheme.matches);
    } else {
      this.setDarkTheme(settings.theme === 'dark')
    }
  }

  settingsMenuElement() {
    const settings = getWidgetsSettings()

    const element = document.createElement('div')
    element.classList.add('settings-menu-item')
    element.innerHTML = settingsMenuHtml

    // Add event listener to select element
    const select = element.querySelector('select')
    select.value = settings.theme ?? 'system'
    select.addEventListener('change', (e)=> this.changeTheme((e.target as HTMLInputElement).value))

    element.appendChild(select)

    return element
  }


  private changeTheme(theme:string){
    if(theme === 'system'){
      this.systemTheme()
    } else {
      this.setDarkTheme(theme === 'dark')
    }
    setWidgetsSetting('theme', theme)
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
    if(set){
      document.documentElement.classList.add("theme-dark")
    } else {
      document.documentElement.classList.remove("theme-dark")
    }
  }

}

export type { ThemeController }
const themeController = ThemeController.getInstance()
export default themeController