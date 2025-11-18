import {dateTimeTabHtml } from "./html";

class DateTimeTabController {
  static instance: DateTimeTabController | null = null
  static getInstance() {
    if (!DateTimeTabController.instance) {
      DateTimeTabController.instance = new DateTimeTabController()
    }
    return DateTimeTabController.instance
  }

  build(container: HTMLElement){
    const elem = document.createElement('section')
    elem.innerHTML = dateTimeTabHtml

    container.appendChild(elem)
  }

}

export type { DateTimeTabController }
const dateTimeTabController = DateTimeTabController.getInstance()
export default dateTimeTabController