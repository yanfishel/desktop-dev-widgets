import {wait} from "../utils";

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

  async show(message: string, delay = 3000) {
    if(this.#visible || this.#timeout) {
      await this.hide()
    }
    this.#toastElement.textContent = message;
    this.#toastElement.classList.remove('hidden');
    this.#visible = true;
    this.#timeout = setTimeout(() => this.hide(), delay);
  }

  success(message: string, delay = 3000) {
    this.#toastElement.classList.add('success');
    this.show(message, delay);
  }

  error(message: string, delay = 3000) {
    this.#toastElement.classList.add('error');
    this.show(message, delay);
  }

  async hide() {
    this.#toastElement.classList.add('hidden');
    await wait(0.25)
    this.#toastElement.textContent = ''
    this.#toastElement.classList.remove('success', 'error', 'warning', 'info', 'loading');
    if(this.#timeout) {
      clearTimeout( this.#timeout )
    }
    this.#visible = false;
  }

}

export type { Toast }
export default Toast