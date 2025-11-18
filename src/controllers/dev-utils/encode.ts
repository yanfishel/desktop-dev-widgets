import { encodeTabHtml} from "./html";

class EncodeTabController {
  static instance: EncodeTabController | null = null
  static getInstance() {
    if (!EncodeTabController.instance) {
      EncodeTabController.instance = new EncodeTabController()
    }
    return EncodeTabController.instance
  }

  build(container: HTMLElement){
    const elem = document.createElement('section')
    elem.innerHTML = encodeTabHtml

    container.appendChild(elem)
  }

}

export type { EncodeTabController }
const encodeTabController = EncodeTabController.getInstance()
export default encodeTabController