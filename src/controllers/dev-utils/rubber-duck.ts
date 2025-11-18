import {rubberDuckTabHtml} from "./html";
import {lightOffIcon, lightOnIcon} from "../../assets";
import {getStorageItem, removeStorageItem, setStorageItem} from "../../utils";

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

  build(container: HTMLElement){
    const elem = document.createElement('section')
    elem.innerHTML = rubberDuckTabHtml

    this.#duckImage = elem.querySelector('.rubber-duck-image')
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

  filterToggle(){
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