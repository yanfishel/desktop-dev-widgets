import {wait} from "@utils";
import {closeIcon} from "@assets";

import './style.css'

export type TToastProps = { message:string, delay?:number|'infinity', closeButton?:boolean }

class Toast {

  #timeout: NodeJS.Timeout | null = null;

  #visible = false;
  #toastElement: HTMLElement;
  #container: HTMLElement;

  constructor(container: HTMLElement) {
    this.#toastElement = document.createElement('div');
    this.#toastElement.classList.add('toast');
    this.#toastElement.classList.add('hidden');
    this.#container = container;
    this.#container.appendChild(this.#toastElement);
  }

  public async show({message, delay = 3000}:TToastProps) {
    const text = document.createTextNode(message)
    this.#toastElement.appendChild(text);
    this.#toastElement.classList.remove('hidden');
    this.#visible = true;
    if(delay !== 'infinity') {
      this.#timeout = setTimeout(() => this.hide(), delay);
    }
  }

  public async success({ message, delay = 3000, closeButton = false}:TToastProps) {
    if(this.#visible || this.#timeout) {
      await this.hide()
    }
    this.#toastElement.classList.add('success');
    if(closeButton) {
      this.addCloseButton()
    }
    this.show({message, delay});
  }

  public async error({ message, delay = 3000, closeButton = false}:TToastProps) {
    if(this.#visible || this.#timeout) {
      await this.hide()
    }
    this.#toastElement.classList.add('error');
    if(closeButton) {
      this.addCloseButton()
    }
    this.show({message, delay});
  }

  private addCloseButton() {
    const button = document.createElement('button');
    button.innerHTML = closeIcon;
    this.#toastElement.appendChild(button);
    button.addEventListener('click', () => this.hide());
  }

  private removeCloseButton() {
    this.#toastElement.querySelector('button')?.remove();
  }

  public async hide() {
    this.#toastElement.classList.add('hidden');
    await wait(0.25)
    this.removeCloseButton()
    this.#toastElement.innerHTML = ''
    this.#toastElement.classList.remove('success', 'error', 'warning', 'info', 'loading');
    if(this.#timeout) {
      clearTimeout( this.#timeout )
    }
    this.#visible = false;
  }

}

export type { Toast }
export default Toast