import {DEFAULT_PORT, SERVER_RESPONSE} from "../../constants";
import {getWidgetsSettings, setWidgetsWidgetSetting} from "../../utils";
import Toast from "../toast";
import {mockServerWidgetHtml, settingsMenuMockServerHtml} from "./html";
import "./style.css"


class MockServerController {
  static instance:MockServerController | null = null

  #port = DEFAULT_PORT
  #isRunning = false

  #toast: Toast
  #loader: HTMLElement
  #portInput: HTMLInputElement
  #testButton: HTMLButtonElement
  #onOffCheckbox: HTMLInputElement


  static getInstance() {
    if (!MockServerController.instance) {
      MockServerController.instance = new MockServerController()
    }

    return MockServerController.instance
  }


  public build(container: HTMLElement) {
    const settings = getWidgetsSettings()

    const elem = document.createElement('div')
    elem.id = settings.widgets.mockServer.id
    elem.innerHTML = mockServerWidgetHtml
    elem.style.order = settings.widgets.mockServer.order.toString()
    elem.style.display = settings.widgets.mockServer.active ? 'block' : 'none'

    this.#portInput = elem.querySelector('input[name="mock-server-port"]')
    this.#portInput.value = this.#port.toString()

    this.#loader = elem.querySelector('.loader')

    this.#testButton = elem.querySelector('.test-button')
    this.#testButton.addEventListener('click', ()=> this.testServer() )

    this.#onOffCheckbox = elem.querySelector('input[name="mock-server-on-off"]')
    this.#onOffCheckbox.addEventListener('change', (e)=> this.toggleServer((e.target as HTMLInputElement).checked) )

    this.#toast = new Toast(elem)

    this.toggleServer()
    this.serverIsRunning(false)

    container.appendChild(elem)
  }

  public settingsMenuElement(){
    const settings = getWidgetsSettings()

    const element = document.createElement('div')
    element.classList.add('settings-menu-item')
    element.innerHTML = settingsMenuMockServerHtml
    const checkbox:HTMLInputElement = element.querySelector('input[name="mock-server-active"]')
    checkbox.checked = settings.widgets.mockServer.active

    checkbox.addEventListener('change', (e)=> {
      const target = e.target as HTMLInputElement
      document.getElementById(settings.widgets.mockServer.id).style.display = target.checked ? 'block' : 'none'
      setWidgetsWidgetSetting('mockServer', {...settings.widgets.mockServer, active: target.checked })
    })
    return element
  }

  private async toggleServer(on = false){
    const settings = getWidgetsSettings()
    if(!settings.widgets.mockServer.active) {
      return
    }
    this.loading(true)
    if(on) {
      window.electronAPI.mockServerStart(this.#port)
    } else {
      window.electronAPI.mockServerStop()
    }
  }

  private testServer(){
    const settings = getWidgetsSettings()
    if(!settings.widgets.mockServer.active) {
      return
    }
    this.loading(true)
    this.#port = this.#portInput.valueAsNumber
    window.electronAPI.mockServerTest(this.#port)
  }

  private serverIsRunning(isRunning:boolean){
    this.loading(false)
    this.#isRunning = isRunning
    this.#testButton.disabled = isRunning
    this.#onOffCheckbox.checked = isRunning
  }

  public serverResponse(response:string){
    try {
      const parsedResponse = JSON.parse(response)
      const { message, port } = parsedResponse

      if(message === SERVER_RESPONSE.SERVER_TESTED) {
        this.#portInput.value = port.toString()
        this.serverIsRunning(false)
      }
      if(message === SERVER_RESPONSE.SERVER_STARTED) {
        this.#portInput.value = port.toString()
        this.serverIsRunning(true)
      } else if(message === SERVER_RESPONSE.SERVER_STOPPED) {
        this.serverIsRunning(false)
      }

      this.#toast.success({ message: `${message} ${message !== SERVER_RESPONSE.SERVER_STOPPED ? port : ''}` })

    } catch (e) {
      this.#toast.error({ message: SERVER_RESPONSE.FAILED_PARSE_RESPONSE })
      this.serverIsRunning(false)
    }
  }

  public serverError(error:string){
    try {
      const parsedError = JSON.parse(error)
      const { message } = parsedError
      this.#toast.error({ message })
    } catch (e) {
      this.#toast.error({ message: SERVER_RESPONSE.FAILED_PARSE_RESPONSE })
    } finally {
     this.serverIsRunning(false)
    }
  }

  private loading(isLoading:boolean){
    this.#loader.style.display = isLoading ? 'flex' : 'none'
  }

}

const mockServerController = MockServerController.getInstance()
export default mockServerController