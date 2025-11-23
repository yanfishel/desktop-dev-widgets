import { ColorTranslator } from 'colortranslator'
import {colorTabHtml} from "./html";
import './style.css'


class ColorController {
  static instance: ColorController | null = null

  #translator:any

  #colorInput: HTMLInputElement
  #hex: HTMLInputElement
  #hexa: HTMLInputElement
  #rgb: HTMLInputElement
  #rgba: HTMLInputElement
  #hsl: HTMLInputElement
  #hsla: HTMLInputElement


  static getInstance() {
    if (!ColorController.instance) {
      ColorController.instance = new ColorController()
    }
    return ColorController.instance
  }

  public build(container: HTMLElement){
    const elem = document.createElement('section')
    elem.innerHTML = colorTabHtml

    this.#colorInput = elem.querySelector('input[name="color-picker"]')
    this.#hex = elem.querySelector('input[name="color-hex"]')
    this.#hexa = elem.querySelector('input[name="color-hexa"]')
    this.#rgb = elem.querySelector('input[name="color-rgb"]')
    this.#rgba = elem.querySelector('input[name="color-rgba"]')
    this.#hsl = elem.querySelector('input[name="color-hsl"]')
    this.#hsla = elem.querySelector('input[name="color-hsla"]')

    const color = new ColorTranslator('#c00', {legacyCSS:true})

    console.log( color.RGB )

    //this.#translator.toHEX('#000')

    const newColor = ColorTranslator.toHEX('#000')

    console.log( ColorTranslator.toHEX('#000'),ColorTranslator.toHEXA('#000'),ColorTranslator.toRGB('#000'),ColorTranslator.toRGBA('#000'),ColorTranslator.toHSL('#000'),ColorTranslator.toHSLA('#000')  )

    container.appendChild(elem)
  }

}

export type { ColorController }
const colorController = ColorController.getInstance()
export default colorController