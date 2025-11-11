import {closeIcon, dragIcon, openIcon} from "../../constans";


class SettingsMenu {

  #darkClassName = "theme-dark"
  #dragButton: HTMLElement
  #settingsContainer: HTMLElement
  #openButton: HTMLElement
  #closeButton: HTMLElement
  #settingsMenu: HTMLElement

  build(container: HTMLElement){

    const menuHtml = `<h1>Settings</h1>`


    this.#openButton = document.createElement('div')
    this.#openButton.classList.add('settings-menu-open')
    this.#openButton.classList.add('circle-button')
    this.#openButton.innerHTML = openIcon

    this.#closeButton = document.createElement('div')
    this.#closeButton.classList.add('settings-menu-close')
    this.#closeButton.classList.add('circle-button')
    this.#closeButton.innerHTML = closeIcon

    this.#settingsMenu = document.createElement('div')
    this.#settingsMenu.classList.add('settings-menu')
    this.#settingsMenu.classList.add('container')
    this.#settingsMenu.innerHTML = menuHtml
    this.#settingsMenu.appendChild( this.#closeButton )
    this.#settingsMenu.style.display = 'none'

    // Collect Menu items
    const themeItem = this.settingsTheme()
    this.#settingsMenu.appendChild( themeItem )

    this.#settingsContainer = document.createElement('div')
    this.#settingsContainer.id = 'settings-container'

    this.#settingsContainer.appendChild( this.#openButton )
    this.#settingsContainer.appendChild( this.#settingsMenu )

    // DRAGGABLE ICON
    /*this.#dragButton = document.createElement('div')
    this.#dragButton.id = 'drag-icon'
    this.#dragButton.innerHTML = dragIcon
    container.appendChild(this.#dragButton)*/

    container.appendChild( this.#settingsContainer )

    this.#openButton.addEventListener('click', () => {
      this.#settingsMenu.style.display = 'block'
    })

    this.#closeButton.addEventListener('click', () => {
      this.#settingsMenu.style.display = 'none'
    })

    document.addEventListener('blur', (e:any)=>{
      if(e.target.id !== 'settings-container'){
        this.#settingsMenu.style.display = 'none'
      }
    })
  }

  settingsTheme() {
    const select = document.createElement('select')
    select.id = 'theme'
    select.innerHTML = `<option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>`
    select.addEventListener('change', (e:any)=>{
      const value = e.target.value
      if(value === 'system'){
        this.systemTheme()
      } else {
        this.setDarkTheme(value === 'dark')
      }
    })

    const element = document.createElement('div')
    element.classList.add('settings-menu-item')
    element.innerHTML = `<label for="theme">Theme</label>`
    element.appendChild(select)

    return element

  }

  systemTheme(){

    const systemDarkTheme = window.matchMedia("(prefers-color-scheme: dark)");
    this.setDarkTheme(systemDarkTheme.matches);
    systemDarkTheme.addEventListener("change", (e)=>this.setDarkTheme(e.matches));


    /*document.getElementById("theme-swither").addEventListener("click", (e)=>{
      e.preventDefault();
      this.setDarkTheme(!document.documentElement.classList.contains(this.#darkClassName))
    });*/
  }

  setDarkTheme(set:boolean){
    document.documentElement.className = set ? this.#darkClassName : '';
  }

}

export default new SettingsMenu()