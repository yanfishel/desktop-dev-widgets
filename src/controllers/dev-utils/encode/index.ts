import * as jose from 'jose'
import hljs from "highlight.js";
import "highlight.js/styles/a11y-light.css";

import {debounce, filetoBase32, fileToBase64, formatBytes, getStorageItem, htmlFilePreview, setStorageItem} from "../../../utils";
import Toast from "../../../controllers/toast";
import {encodeTabHtml} from "./html";
import './style.css'


class EncodeTabController {
  static instance: EncodeTabController | null = null

  fileEncodeTypes = ['base64', 'base32']
  textEncodeTypes = ['JWT', 'URL']

  #file: File | null = null

  #toast: Toast
  #container: HTMLElement
  #dragZone: HTMLElement
  #encodeTypeSelect: HTMLSelectElement
  #decodedJwtHeaderEditable: HTMLDivElement
  #decodedTextEditable: HTMLDivElement
  #encodedTextEditable: HTMLDivElement
  #decodedFileContainer: HTMLElement

  #signatureButton: HTMLElement
  #signatureSecret: HTMLInputElement


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

    // CLEAR & COPY BUTTONS
    const clearButtons = elem.querySelectorAll('.clear-button')
    clearButtons.forEach(button => button.addEventListener('click', (e)=> this.onClearButtonHandler(e)))

    const copyButtons = elem.querySelectorAll('.copy-button')
    copyButtons.forEach(button => button.addEventListener('click', (e)=> this.onCopyButtonHandler(e)))

    // Download File Button
    const downloadButton = elem.querySelector('.download-button')
    downloadButton.addEventListener('click', ()=> this.downloadFile())

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
    // ./ - DRAG & DROP FILES

    // SET TEXT ENCODE / DECODE Textarea
    this.#decodedJwtHeaderEditable = elem.querySelector('.decoded-jwt-header-editable')
    this.#decodedJwtHeaderEditable.addEventListener('keyup', debounce(()=> this.onDecodedJwtHeaderChange(), 250))

    this.#decodedTextEditable = elem.querySelector('.decoded-text-editable')
    this.#decodedTextEditable.addEventListener('keyup', debounce(()=> this.onDecodedTextChange(), 250))

    this.#encodedTextEditable = elem.querySelector('.encoded-text-editable')
    this.#encodedTextEditable.addEventListener('keyup', debounce(()=>this.onEncodedTextChange(), 250))

    // SET Encode Type Select
    const selectedEncodeType = getStorageItem('dev-utils-encode-type') ?? 'base64'
    this.#encodeTypeSelect = elem.querySelector('select[name="encode-type"]')
    this.#encodeTypeSelect.addEventListener('change', (e)=> this.toggleEncodeType(e))
    this.#encodeTypeSelect.value = selectedEncodeType
    this.#container.classList.add(`encode-type-${ selectedEncodeType }`)

    // SET Signature Secret
    this.#signatureButton = elem.querySelector('.signature-button')
    this.#signatureButton.addEventListener('click', ()=> elem.querySelector('.signature-container').classList.toggle('open'))
    document.addEventListener('click', (e)=> {
      const target = e.target as HTMLElement
      if(!elem.querySelector('.signature-container').contains(target)) {
        elem.querySelector('.signature-container').classList.remove('open')
      }
    })
    const signatureSecret = getStorageItem('dev-utils-signature-secret') ?? 's3cre!'
    this.#signatureSecret = elem.querySelector('input[name="signature-secret"]')
    this.#signatureSecret.value = signatureSecret
    this.#signatureSecret.addEventListener('change', (e)=> setStorageItem('dev-utils-signature-secret', (e.target as HTMLInputElement).value))

    // Paste plain text from clipboard to contenteditable div
    elem.addEventListener("paste", function(e) {
      e.preventDefault();
      // Get the plain text content from the clipboard
      let content = '';
      if (e.clipboardData) {
        content = e.clipboardData.getData('text/plain');
      }
      document.execCommand('insertText', false, content);
    });

    this.#toast = new Toast(this.#container)

    container.appendChild(elem)
  }


  private toggleEncodeType(e:Event){
    const target = e.target as HTMLSelectElement
    [...this.fileEncodeTypes, ...this.textEncodeTypes].forEach(type => this.#container.classList.remove(`encode-type-${type}`))
    this.#container.classList.add(`encode-type-${target.value}`)
    this.clearElement(this.#decodedJwtHeaderEditable)
    this.clearElement(this.#decodedTextEditable)
    this.clearElement(this.#encodedTextEditable)
    this.removeFile()
    setStorageItem('dev-utils-encode-type', target.value)
  }

  private async onDecodedJwtHeaderChange(){
    const header = this.#decodedJwtHeaderEditable.textContent.replace(/\s/g, '').trim()
    this.clearElement(this.#decodedJwtHeaderEditable, false)
    if(!header) {
      return
    }
    this.#decodedJwtHeaderEditable.classList.add('has-text')

    this.clearElement(this.#encodedTextEditable)
    const encoded = await this.jwtEncode(header)
    if(encoded) {
      this.textContent(this.#encodedTextEditable, encoded)
    } else {
      this.textContentWithError(this.#encodedTextEditable, '')
    }
  }

  private async onDecodedTextChange(){
    const text = this.getEditableText(this.#decodedTextEditable)
    this.clearElement(this.#decodedTextEditable, false)
    if(!text) {
      return
    }
    this.#decodedTextEditable.classList.add('has-text')

    this.clearElement(this.#encodedTextEditable)

    if(this.#encodeTypeSelect.value === 'URL') {
      const text = this.#decodedTextEditable.textContent
      this.innerHtml(this.#encodedTextEditable, encodeURIComponent(text))
    } else {
      const encoded = await this.jwtEncode(text)
      if(encoded) {
        this.textContent(this.#encodedTextEditable, encoded)
      } else {
        this.textContentWithError(this.#encodedTextEditable, '')
      }
    }
  }

  private onEncodedTextChange(){
    const text = this.getEditableText(this.#encodedTextEditable)

    this.clearElement(this.#encodedTextEditable, false)

    if(!text) {
      return
    }
    this.#encodedTextEditable.classList.add('has-text')

    this.clearElement(this.#decodedJwtHeaderEditable)
    this.clearElement(this.#decodedTextEditable)

    if(this.#encodeTypeSelect.value === 'base64' || this.#encodeTypeSelect.value === 'base32') {
      this.updateFile(this.#encodedTextEditable.textContent)
    } else if(this.#encodeTypeSelect.value === 'URL') {
      this.textContent(this.#decodedTextEditable, decodeURIComponent(text))
    } else {

      const header = this.jwtDecodeHeader(text)
      if(header) {
        const highHeader = this.highlightText(header)
        if(highHeader) {
          this.innerHtml(this.#decodedJwtHeaderEditable, highHeader)
        } else {
          this.innerHtmlWithError(this.#decodedJwtHeaderEditable, '')
        }
      } else {
        this.innerHtmlWithError(this.#decodedJwtHeaderEditable, '')
      }

      const claim = this.jwtDecode(text)
      if(claim) {
        const highlighted = this.highlightText(claim)
        if(highlighted) {
          this.innerHtml(this.#decodedTextEditable, highlighted)
        } else {
          this.innerHtmlWithError(this.#decodedTextEditable, '')
        }
      } else {
        this.innerHtmlWithError(this.#decodedTextEditable, '')
      }

    }
  }

  private addFile(file:File){
    this.#decodedFileContainer.innerHTML = ''

    const image = htmlFilePreview(file)
    this.#decodedFileContainer.appendChild(image)
    const name = document.createElement('div')
    const p = document.createElement('p')
    p.textContent = file.name ?? `decoded-file.${ file.type.split('/')[1] || '' }`
    name.appendChild(p)
    this.#decodedFileContainer.appendChild(name)
    const size = document.createElement('div')
    size.textContent = `${formatBytes(file.size)}`
    this.#decodedFileContainer.appendChild(size)

    this.#container.classList.add('has-file')
  }

  private updateFile(text:string){
    this.removeFile()
    if(this.#encodeTypeSelect.value === 'base32'){
      return
    }
    const file = this.createFileFromBase64(text)
    if(!file) {
      this.#container.classList.add('has-file', 'file-error')
      return
    }
    this.#file = file

    const testimg = new Image();
    testimg.onload = () => {
      testimg.remove();
    }
    testimg.onerror = () => {
      testimg.remove();
      this.#container.classList.add('file-error')
    }
    testimg.src = URL.createObjectURL(file);

    this.addFile(file)
  }

  private createFileFromBase64(text:string){
    const base64Data = text.split(',')
    if(base64Data.length !== 2) {
      return null
    }
    const mimeType = base64Data[0].match(/:(.*?);/)?.[1]
    try {
      // Decode Base64 to a binary string
      const binaryString = window.atob(base64Data[1]);

      // Create a Uint8Array from the binary string
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Create a Blob object
      const blob = new Blob([bytes], { type: mimeType });
      return new File([blob], 'decoded-file', {type: blob.type})
    } catch (e) {
      console.log('Error create file', e);
      return null
    }
  }

  private downloadFile(){
    if(!this.#file) {
      return
    }
    const fileName = this.#file.name ?? `decoded-file.${ this.#file.type.split('/')[1] || '' }`
    const file = new File(
      [this.#file],
      fileName,
      { type: this.#file.type }
    )
    // Create a download link and trigger the download
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(file);
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    window.URL.revokeObjectURL(downloadLink.href);
  }

  private removeFile(){
    this.#file = null
    this.#decodedFileContainer.innerHTML = ''
    this.#container.classList.remove('has-file', 'file-error')
  }

  private onClearButtonHandler(e:Event){
    const target = e.target as HTMLElement
    const fieldName = target.dataset.clear || (target.closest('.clear-button') as HTMLElement)?.dataset.clear
    const encodeType = this.#encodeTypeSelect.value

    switch (encodeType) {
      case 'base64':
        if(fieldName === 'all') {
          this.removeFile()
          this.clearElement(this.#encodedTextEditable)
        } else if(fieldName === 'encoded-text') {
          this.clearElement(this.#encodedTextEditable)
        } else if(fieldName === 'decoded-text') {
          this.removeFile()
        }
        break
      case 'base32':
        if(fieldName === 'all') {
          this.removeFile()
          this.clearElement(this.#encodedTextEditable)
        } else if(fieldName === 'encoded-text') {
          this.clearElement(this.#encodedTextEditable)
        } else if(fieldName === 'decoded-text') {
          this.removeFile()
        }
        break
      case 'JWT':
        if(fieldName === 'all') {
          this.clearElement(this.#decodedJwtHeaderEditable)
          this.clearElement(this.#decodedTextEditable)
          this.clearElement(this.#encodedTextEditable)
        } else if(fieldName === 'encoded-text') {
          this.clearElement(this.#encodedTextEditable)
        } else if(fieldName === 'decoded-text') {
          this.clearElement(this.#decodedJwtHeaderEditable)
          this.clearElement(this.#decodedTextEditable)
        }
        break
      case 'URL':
        if(fieldName === 'encoded-text') {
          this.clearElement(this.#encodedTextEditable)
        } else if(fieldName === 'decoded-text') {
          this.clearElement(this.#decodedJwtHeaderEditable)
          this.clearElement(this.#decodedTextEditable)
        }
        break
    }
  }

  private async onCopyButtonHandler(e:Event){
    const target = e.target as HTMLElement
    const fieldName = target.dataset.copy || (target.closest('.copy-button') as HTMLElement)?.dataset.copy
    const text = fieldName === 'encoded-text'
      ? this.#encodedTextEditable.textContent
      : this.#decodedTextEditable.textContent
    if(!text) {
      return
    }
    try {
      await navigator.clipboard.writeText(text);
      this.#toast.success({message:'Copied!'})
    } catch (err) {
      this.#toast.error({message:'Failed to copy!'})
      console.error('Failed to copy: ', err);
    }
  }

  private async handleFileDrop(e:DragEvent){
    const file = e.dataTransfer.files[0];
    const encodeTypeSelected = this.#encodeTypeSelect.value
    if(!file || !this.fileEncodeTypes.includes(encodeTypeSelected)) {
      return
    }

    this.#file = file
    this.addFile(file)

    this.clearElement(this.#encodedTextEditable)
    const result = encodeTypeSelected === 'base64'
      ? await fileToBase64(file)
      : await filetoBase32(file)
    if(result){
      this.textContent(this.#encodedTextEditable, result.toString())
    } else {
      this.textContentWithError(this.#encodedTextEditable, '')
    }
  }

  private jwtDecodeHeader(text:string){
    try {
      const header = jose.decodeProtectedHeader(text)
      return JSON.stringify(header, null, 2)
    } catch (e) {
      console.log('Invalid JWT Header', e)
    }
  }

  private jwtDecode(text:string){
    try {
      const decoded = jose.decodeJwt(text)
      return JSON.stringify(decoded, null, 2)
    } catch (e) {
      console.log('Invalid JWT', e)
    }
  }

  private async jwtEncode(text:string){
    try {
      const obj = JSON.parse(text)
      const signSecret = this.#signatureSecret.value
      const secret = new TextEncoder().encode(signSecret)
      let protectedHeader = {alg:'HS256', typ: "JWT"}
      const header = this.getEditableText(this.#decodedJwtHeaderEditable)
      if(header) {
        protectedHeader = JSON.parse(this.getEditableText(this.#decodedJwtHeaderEditable))
      }

      const jwt = await new jose.SignJWT(obj)
        .setProtectedHeader(protectedHeader)
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(secret)
      return jwt
    } catch (e) {
      console.log('Invalid JSON', e);
    }
  }

  private highlightText(text:string){
    try {
      const highlighted = hljs.highlight(text, {language: 'json', ignoreIllegals: true})
      return `<pre><code>${highlighted.value}</code></pre>`
    } catch (e) {
      console.log('Invalid Highlighte code', e)
    }
  }

  private getEditableText(element: HTMLElement){
    return element.textContent.replace(/\s/g, '').trim()
  }

  private textContent(element:HTMLElement, text:string){
    element.textContent = text
    element.classList.add('has-text')
  }

  private textContentWithError(element:HTMLElement, text:string){
    element.textContent = text
    element.classList.add('has-error')
  }

  private innerHtml(element:HTMLElement, text:string){
    element.innerHTML = text
    element.classList.add('has-text')
  }

  private innerHtmlWithError(element:HTMLElement, text:string){
    element.innerHTML = text
    element.classList.add('has-error')
  }

  private clearElement(element:HTMLElement, clearText = true){
    if(clearText){
      element.innerHTML = ''
    }
    element.classList.remove('has-text')
    element.classList.remove('has-error')
  }

}

export type { EncodeTabController }
const encodeTabController = EncodeTabController.getInstance()
export default encodeTabController