import { ColorTranslator } from 'colortranslator'

import {STORAGE_KEYS} from "../../../constants";
import {debounce, getStorageItem, setStorageItem} from "../../../utils"
import Toast from "../../../controllers/toast";
import {colorTabHtml} from "./html"
import './style.css'


class ColorController {
  static instance: ColorController | null = null

  #toast: Toast
  #error:HTMLElement

  #Color: ColorTranslator | null = null

  #colorPreviewTop: HTMLElement
  #colorPreviewBottom: HTMLElement
  #colorInput: HTMLInputElement
  #inputHex: HTMLInputElement
  #inputR: HTMLInputElement
  #inputG: HTMLInputElement
  #inputB: HTMLInputElement
  #inputA: HTMLInputElement
  #inputAlpha: HTMLInputElement

  #hex: HTMLInputElement
  #hexa: HTMLInputElement
  #rgb: HTMLInputElement
  #rgba: HTMLInputElement
  #hsl: HTMLInputElement
  #hsla: HTMLInputElement
  #hwb: HTMLInputElement
  #hwba: HTMLInputElement


  static getInstance() {
    if (!ColorController.instance) {
      ColorController.instance = new ColorController()
    }
    return ColorController.instance
  }

  public build(container: HTMLElement){
    const elem = document.createElement('section')
    elem.innerHTML = colorTabHtml

    this.#error = elem.querySelector('.color-error')

    this.#toast = new Toast(elem.querySelector('.color-container'))

    this.#colorPreviewTop = elem.querySelector('.color-preview-top')
    this.#colorPreviewBottom = elem.querySelector('.color-preview-bottom')
    const colorPreview = elem.querySelector('.color-preview')
    colorPreview.addEventListener('click', ()=> this.#colorInput.click())

    this.#colorInput = elem.querySelector('input[name="color-picker"]')
    this.#inputHex = elem.querySelector('input[name="input-hex"]')
    this.#inputR = elem.querySelector('input[name="input-r"]')
    this.#inputG = elem.querySelector('input[name="input-g"]')
    this.#inputB = elem.querySelector('input[name="input-b"]')
    this.#inputA = elem.querySelector('input[name="input-a"]')
    this.#inputAlpha = elem.querySelector('input[name="input-alpha"]')

    this.#hex = elem.querySelector('input[name="color-hex"]')
    this.#hexa = elem.querySelector('input[name="color-hexa"]')
    this.#rgb = elem.querySelector('input[name="color-rgb"]')
    this.#rgba = elem.querySelector('input[name="color-rgba"]')
    this.#hsl = elem.querySelector('input[name="color-hsl"]')
    this.#hsla = elem.querySelector('input[name="color-hsla"]')
    this.#hwb = elem.querySelector('input[name="color-hwb"]')
    this.#hwba = elem.querySelector('input[name="color-hwba"]')

    this.#colorInput.addEventListener('input', debounce((e:Event)=> {
      this.updateColorInputs((e.target as HTMLInputElement).value)
    }, 250))
    this.#colorInput.addEventListener('change', (e:Event)=> {
      this.updateColorInputs((e.target as HTMLInputElement).value)
    })

    this.#inputHex.addEventListener('input', debounce((e:Event)=> {
      this.updateColorInputs((e.target as HTMLInputElement).value, 'inputHex')
    }, 250) )

    this.#inputR.addEventListener('input', () => this.updateColorInputs(this.rgbaString(), 'inputR'))
    this.#inputG.addEventListener('input', () => this.updateColorInputs(this.rgbaString(), 'inputG'))
    this.#inputB.addEventListener('input', () => this.updateColorInputs(this.rgbaString(), 'inputB'))
    this.#inputA.addEventListener('input', () => this.updateColorInputs(this.rgbaString(true), 'inputA'))
    this.#inputAlpha.addEventListener('input', () => this.updateColorInputs(this.rgbaString(), 'inputAlpha'))
    this.#inputR.addEventListener('change', () => this.updateColorInputs())
    this.#inputG.addEventListener('change', () => this.updateColorInputs())
    this.#inputB.addEventListener('change', () => this.updateColorInputs())
    this.#inputA.addEventListener('change', () => this.updateColorInputs())

    // Copy buttons
    const copyButtons = elem.querySelectorAll('.copy-button')
    copyButtons.forEach(button => button.addEventListener('click', (e)=>this.copyToClipboard(e)))

    const storedColor = getStorageItem(STORAGE_KEYS.WIDGET_DEVUTILS_COLOR)
    this.#Color = this.getColorInstance(storedColor ?? '#38bdf8')

    this.#colorInput.value = this.#Color.HEX
    this.#inputAlpha.value = this.#Color.A.toString()

    this.handleColorChange()

    container.appendChild(elem)
  }

  private handleColorChange(){
    const event = new Event('change')
    this.#colorInput.dispatchEvent(event)
  }

  private getColorInstance(hex:string){
    try {
      return new ColorTranslator(hex, {legacyCSS:true, spacesAfterCommas:true, decimals:2 })
    } catch (e) {
      return null
    }
  }

  private updateColorInputs(hex?:string, field = 'colorInput'){
    this.#error.classList.remove('show')
    let color:ColorTranslator
    if(hex && field) {
      color = this.getColorInstance(hex)
      if (field !== 'inputHex' && field !== 'inputAlpha' && field !== 'inputA') {
        color.setA(+this.#inputAlpha.value)
      }
    } else {
      color = this.getColorInstance(this.#colorInput.value)
      color.setA(+this.#inputAlpha.value)
    }
    if(!color) {
      this.colorError()
      return
    }
    this.#Color = color

    if(field !== 'colorInput')  this.#colorInput.value = this.#Color.HEX
    if(field !== 'inputHex')    this.#inputHex.value = this.#Color.HEX
    if(field !== 'inputR')      this.#inputR.value = this.#Color.R.toString()
    if(field !== 'inputG')      this.#inputG.value = this.#Color.G.toString()
    if(field !== 'inputB')      this.#inputB.value = this.#Color.B.toString()
    if(field !== 'inputA')      this.#inputA.value = Math.round(this.#Color.A * 100).toString()
    if(field !== 'inputAlpha')  this.#inputAlpha.value = this.#Color.A.toString()
    this.#inputAlpha.style.setProperty('--selected-color', this.#Color.HEX)
    this.#colorPreviewTop.style.backgroundColor = this.#Color.HEX
    this.#colorPreviewBottom.style.backgroundColor = this.#Color.HEXA

    this.updateColorResults()
  }

  private updateColorResults() {
    if(!this.#Color) return
    this.#hex.value = this.#Color.HEX
    this.#hexa.value = this.#Color.HEXA
    this.#rgb.value = this.#Color.RGB
    this.#rgba.value = this.#Color.RGBA
    this.#hsl.value = this.#Color.HSL
    this.#hsla.value = this.#Color.HSLA
    this.#hwb.value = this.#Color.HWB
    this.#hwba.value = this.#Color.HWBA
    setStorageItem(STORAGE_KEYS.WIDGET_DEVUTILS_COLOR, this.#Color.HEXA)
  }

  private resetColorResults(){
    this.#hex.value = ''
    this.#hexa.value = ''
    this.#rgb.value = ''
    this.#rgba.value = ''
    this.#hsl.value = ''
    this.#hsla.value = ''
    this.#hwb.value = ''
    this.#hwba.value = ''
  }

  private colorError(){
    this.#Color = null
    this.resetColorResults()
    this.#colorInput.value = '#000'
    this.#inputAlpha.style.setProperty('--selected-color', '#000')
    this.#colorPreviewTop.style.backgroundColor = '#000'
    this.#colorPreviewBottom.style.backgroundColor = '#000'
    this.#error.classList.add('show')
  }

  private rgbaString(inputA = false) {
    return `rgba(${this.#inputR.value}, ${this.#inputG.value}, ${this.#inputB.value}, ${inputA ? +this.#inputA.value/100 : this.#inputAlpha.value})`;
  }

  private async copyToClipboard(e: Event | MouseEvent | TouchEvent) {
    const target = e.target as HTMLElement;
    const fieldName = target.dataset.copy || (target.closest('.copy-button') as HTMLElement)?.dataset.copy
    if(!fieldName) return
    let value = ''
    switch (fieldName) {
      case 'color-hex': value = this.#hex.value; break;
      case 'color-hexa': value = this.#hexa.value; break;
      case 'color-rgb': value = this.#rgb.value; break;
      case 'color-rgba': value = this.#rgba.value; break;
      case 'color-hsl': value = this.#hsl.value; break;
      case 'color-hsla': value = this.#hsla.value; break;
      case 'color-hwb': value = this.#hwb.value; break;
      case 'color-hwba': value = this.#hwba.value; break;
    }
    if(!value) return
    try {
      await navigator.clipboard.writeText(value);
      this.#toast.success({message: 'Copied!'})
    } catch (err) {
      this.#toast.error({message: 'Failed to copy!'})
      console.error('Failed to copy: ', err);
    }
  }

}

export type { ColorController }
const colorController = ColorController.getInstance()
export default colorController