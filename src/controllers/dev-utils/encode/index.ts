import { encodeTabHtml} from "./html";
import './style.css'
import base32Encode from "base32-encode";

class EncodeTabController {
  static instance: EncodeTabController | null = null

  fileEncodeTypes = ['base64', 'base32']
  textEncodeTypes = ['JWT', 'url']

  #dragZone: HTMLElement
  #encodeTypeSelect: HTMLSelectElement
  #encodedText: HTMLTextAreaElement

  static getInstance() {
    if (!EncodeTabController.instance) {
      EncodeTabController.instance = new EncodeTabController()
    }
    return EncodeTabController.instance
  }

  public build(container: HTMLElement){
    const elem = document.createElement('section')
    elem.innerHTML = encodeTabHtml

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

    this.#encodedText = elem.querySelector('textarea')
    this.#encodedText.spellcheck = false

    this.#encodeTypeSelect = elem.querySelector('select[name="encode-type"]')

    container.appendChild(elem)
  }

  private async handleFileDrop(e:any){
    const file = e.dataTransfer.files[0];
    const encodeTypeSelected = this.#encodeTypeSelect.value
    if(!file || !this.fileEncodeTypes.includes(encodeTypeSelected)) {
      return
    }
    console.log(file.name, file.type, file.size);

    const result = encodeTypeSelected === 'base64'
      ? await this.fileToBase64(file)
      : await this.filetoBase32(file)
    this.#encodedText.value = result.toString()
  }
  
  private async fileToBase64(file:File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result); // This will be the Base64 data URL
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  }

  private async filetoBase32(file:File) {
    try {
      const uint8Array = await this.readFileAsUint8Array(file);
      const base32Encoded = base32Encode(uint8Array as Uint8Array, 'RFC4648'); // Or 'Crockford', 'RFC4648-HEX'
      return base32Encoded;
    } catch (error) {
      console.error("Error converting file to Base32:", error);
    }
  }

  private async readFileAsUint8Array(file:File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }

}

export type { EncodeTabController }
const encodeTabController = EncodeTabController.getInstance()
export default encodeTabController