import {rubberDuckTabHtml} from "./html";
import {lightOffIcon, lightOnIcon} from "../../assets";

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

    container.appendChild(elem)
  }

  filterToggle(){
    if(!this.#isOn) {
      this.#duckImage.classList.add('image-on')
    } else {
      this.#duckImage.classList.remove('image-on')
    }
    this.#isOn = !this.#isOn
    this.#duckFilterButton.innerHTML = !this.#isOn ? lightOnIcon : lightOffIcon
  }

}

export type { RubberDuckTabController }
const rubberDuckTabController = RubberDuckTabController.getInstance()
export default rubberDuckTabController