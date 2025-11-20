import {lightOffIcon, lightOnIcon} from "../../../assets";
import {getStorageItem, removeStorageItem, setStorageItem} from "../../../utils";
import {rubberDuckTabHtml} from "./html";
import './style.css'

class RubberDuckTabController {
  static instance: RubberDuckTabController | null = null

  #duckImage: HTMLElement
  #isOn = false
  #duckFilterButton: HTMLElement
  #openInfoButton: HTMLElement
  #duckInfo: HTMLElement
  #closeInfoButton: HTMLElement

  static getInstance() {
    if (!RubberDuckTabController.instance) {
      RubberDuckTabController.instance = new RubberDuckTabController()
    }
    return RubberDuckTabController.instance
  }

  public build(container: HTMLElement){
    const elem = document.createElement('section')
    elem.innerHTML = rubberDuckTabHtml

    this.#duckImage = elem.querySelector('.rubber-duck-image')

    // Duck INFO Box & External Links
    this.#openInfoButton = elem.querySelector('#info-button')
    this.#duckInfo = elem.querySelector('.rubber-duck-info')
    this.#closeInfoButton = elem.querySelector('.close-info-button')

    this.#openInfoButton.addEventListener('click', ()=> this.#duckInfo.classList.add('open'))
    this.#closeInfoButton.addEventListener('click', ()=> this.#duckInfo.classList.remove('open'))
    document.addEventListener('click', (e:any)=> {
      if(!this.#duckInfo.contains(e.target) && !this.#openInfoButton.contains(e.target)) {
        this.#duckInfo.classList.remove('open')
      }
    })

    elem.querySelectorAll('.external-link').forEach((link:HTMLElement)=> {
      link.addEventListener('click', (e:any)=> {
        const url = e.target.dataset.url
        if(!url) return
        this.#duckInfo.classList.remove('open')
        window.electronAPI.openExternal(url)
      })
    })

    // Duck IMAGE On / Off
    this.#duckFilterButton = elem.querySelector('#filter-button')
    this.#duckFilterButton.addEventListener('click', ()=> this.filterToggle())

    const duckFilter = getStorageItem('dev-utils-duck-filter')
    if(duckFilter) {
      this.#duckImage.classList.add('image-on')
      this.#duckFilterButton.innerHTML = lightOffIcon
      this.#isOn = true
    }

    container.appendChild(elem)
  }

  private filterToggle(){
    this.#isOn = !this.#isOn
    if(this.#isOn) {
      this.#duckImage.classList.add('image-on')
      setStorageItem('dev-utils-duck-filter', '1')
    } else {
      this.#duckImage.classList.remove('image-on')
      removeStorageItem('dev-utils-duck-filter')
    }
    this.#duckFilterButton.innerHTML = !this.#isOn ? lightOnIcon : lightOffIcon
  }

}

export type { RubberDuckTabController }
const rubberDuckTabController = RubberDuckTabController.getInstance()
export default rubberDuckTabController