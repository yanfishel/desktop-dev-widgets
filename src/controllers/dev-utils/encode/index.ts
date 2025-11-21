import base32Encode from "base32-encode";
import {filetoBase32, fileToBase64, formatBytes, getStorageItem, htmlFilePreview, setStorageItem} from "../../../utils";

import { encodeTabHtml} from "./html";
import './style.css'
import {jwtDecode, JwtPayload} from "jwt-decode";
import hljs from "highlight.js";
import "highlight.js/styles/a11y-light.css";
import "highlight.js/styles/a11y-dark.css";


class EncodeTabController {
  static instance: EncodeTabController | null = null

  fileEncodeTypes = ['base64', 'base32']
  textEncodeTypes = ['JWT', 'url']

  decodedFile: File | null = null
  encodedFileText: ''
  decodedText = ''
  encodedText = ''

  #container: HTMLElement
  #dragZone: HTMLElement
  #encodeTypeSelect: HTMLSelectElement
  #decodedTextArea: HTMLTextAreaElement

  #decodedTextEditable: HTMLDivElement

  #encodedTextArea: HTMLTextAreaElement
  #decodedFileContainer: HTMLElement
  #encodedFileTextArea: HTMLTextAreaElement

  static getInstance() {
    if (!EncodeTabController.instance) {
      EncodeTabController.instance = new EncodeTabController()
    }
    return EncodeTabController.instance
  }

  public build(container: HTMLElement){
    const elem = document.createElement('section')
    elem.innerHTML = encodeTabHtml

    this.#container = elem.querySelector('.encode-container')
    this.#decodedFileContainer = elem.querySelector('.decoded-file-container')

    // DRAG & DROP FILES
    this.#dragZone = elem.querySelector('.drag-zone');
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      this.#dragZone.addEventListener(eventName, (e)=>{
        e.preventDefault();
        e.stopPropagation();
      }, false);
    });
    // Highlight drop zone on drag over
    ['dragenter', 'dragover'].forEach(eventName => {
      this.#dragZone.addEventListener(eventName, () => this.#dragZone.classList.add('highlight'), false);
    });
    ['dragleave', 'drop'].forEach(eventName => {
      this.#dragZone.addEventListener(eventName, () => this.#dragZone.classList.remove('highlight'), false);
    });
    // Handle dropped files
    this.#dragZone.addEventListener('drop', (e) => this.handleFileDrop(e), false)

    // SET TEXT ENCODE / DECODE Textarea
    /*this.#decodedTextArea = elem.querySelector('textarea[name="decoded-text-input"]')
    this.#decodedTextArea.spellcheck = false
    this.#decodedTextArea.addEventListener('keyup', (e:any)=> this.onDecodeTextChange(e))*/

    this.#decodedTextEditable = elem.querySelector('.decoded-text-editable')
    this.#decodedTextEditable.spellcheck = false
    this.#decodedTextEditable.addEventListener('keyup', (e:any)=> this.onDecodeTextChange(e))

    this.#encodedTextArea = elem.querySelector('textarea[name="encoded-text-output"]')
    this.#encodedTextArea.spellcheck = false
    this.#encodedTextArea.addEventListener('keyup', (e:any)=> this.onEncodedTextChange(e))
    this.#encodedFileTextArea = elem.querySelector('textarea[name="encoded-file-text-output"]')
    this.#encodedTextArea.spellcheck = false
    this.#encodedFileTextArea.addEventListener('keyup', (e:any)=> this.onEncodedFileTextChange(e))

    // SET Encode Type Select
    const selectedEncodeType = getStorageItem('dev-utils-encode-type') ?? 'base64'
    this.#encodeTypeSelect = elem.querySelector('select[name="encode-type"]')
    this.#encodeTypeSelect.addEventListener('change', (e:any)=> this.toggleEncodeType(e))
    this.#encodeTypeSelect.value = selectedEncodeType
    this.#container.classList.add(`encode-type-${ selectedEncodeType }`)

    container.appendChild(elem)
  }

  private toggleEncodeType(e:any){
    [...this.fileEncodeTypes, ...this.textEncodeTypes].forEach(type => this.#container.classList.remove(`encode-type-${type}`))
    this.#container.classList.add(`encode-type-${e.target.value}`)
    setStorageItem('dev-utils-encode-type', e.target.value)
  }

  private onDecodeTextChange(e:any){
    const text = e.target.value
    this.decodedText = ''
    if(!text.toString().trim()) {
      return
    }
    this.decodedText = text
    if(this.#encodeTypeSelect.value === 'url') {
      this.#encodedTextArea.value = encodeURIComponent(text)
    } else {
      this.#encodedTextArea.value = base32Encode(text, 'RFC4648')
    }
  }

  private onEncodedTextChange(e:any){
    const text = e.target.value
    this.encodedText = ''
    if(!text.toString().trim()) {
      return
    }
    this.encodedText = text
    if(this.#encodeTypeSelect.value === 'url') {
      //this.#decodedTextArea.value = decodeURIComponent(text)
      this.#decodedTextEditable.textContent = decodeURIComponent(text)
    } else {
      try {
        const decoded = jwtDecode<JwtPayload>(text)
        const parsed = JSON.stringify(decoded, null, 2)
        console.log('decoded', decoded)
        if(parsed){
          const highlighted = hljs.highlight(parsed, {language:'json', ignoreIllegals:true})
          console.log('highlighted', highlighted)
          //this.#decodedTextArea.value = parsed
          this.#decodedTextEditable.innerHTML = `<pre class="a11y-dark"><code>${ highlighted.value }</code></pre>`
        }
      } catch (e) {
        console.error('Invalid JWT', e)
      }
    }
  }

  private onEncodedFileTextChange(e:any){
    const text = e.target.value
    this.encodedFileText = ''
    if(!text.toString().trim()) {
      return
    }
    this.encodedFileText = text
  }

  private addFile(file:File){
    this.#decodedFileContainer.innerHTML = ''
    this.decodedFile = file

    const image = htmlFilePreview(file)
    this.#decodedFileContainer.appendChild(image)
    const name = document.createElement('div')
    const p = document.createElement('p')
    p.textContent = file.name
    name.appendChild(p)
    this.#decodedFileContainer.appendChild(name)
    const size = document.createElement('div')
    size.textContent = `${formatBytes(file.size)}`
    this.#decodedFileContainer.appendChild(size)

    this.#container.classList.add('has-file')
  }

  private removeFile(){
    this.decodedFile = null
    this.#decodedFileContainer.innerHTML = ''
    this.#container.classList.remove('has-file')
  }

  private async handleFileDrop(e:any){
    const file = e.dataTransfer.files[0];
    const encodeTypeSelected = this.#encodeTypeSelect.value
    if(!file || !this.fileEncodeTypes.includes(encodeTypeSelected)) {
      return
    }

    this.addFile(file)

    const result = encodeTypeSelected === 'base64'
      ? await fileToBase64(file)
      : await filetoBase32(file)
    this.#encodedFileTextArea.value = result.toString()
  }

}

export type { EncodeTabController }
const encodeTabController = EncodeTabController.getInstance()
export default encodeTabController