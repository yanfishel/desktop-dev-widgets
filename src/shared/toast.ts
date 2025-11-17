import {wait} from "../utils";
import {closeIcon} from "../assets";

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

  async show(message: string, delay:number|'infinity' = 3000) {
    const text = document.createTextNode(message)
    this.#toastElement.appendChild(text);
    this.#toastElement.classList.remove('hidden');
    this.#visible = true;
    if(delay !== 'infinity') {
      this.#timeout = setTimeout(() => this.hide(), delay);
    }
  }

  async success(message: string, delay:number|'infinity' = 3000, closeButton = false) {
    if(this.#visible || this.#timeout) {
      await this.hide()
    }
    this.#toastElement.classList.add('success');
    if(closeButton) {
      this.addCloseButton()
    }
    this.show(message, delay);
  }

  async error(message: string, delay:number|'infinity' = 3000, closeButton = false) {
    if(this.#visible || this.#timeout) {
      await this.hide()
    }
    this.#toastElement.classList.add('error');
    if(closeButton) {
      this.addCloseButton()
    }
    this.show(message, delay);
  }

  addCloseButton() {
    const button = document.createElement('button');
    button.innerHTML = closeIcon;
    this.#toastElement.appendChild(button);
    button.addEventListener('click', () => this.hide());
  }

  removeCloseButton() {
    this.#toastElement.querySelector('button')?.remove();
  }

  async hide() {
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