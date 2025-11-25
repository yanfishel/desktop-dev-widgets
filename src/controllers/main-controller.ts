import sizeController from "./widgets-size";
import themeController from "./theme";
import lockPositionController from "./lock-position";
import settingsMenuController from "./settings-menu";
import weatherController from "./weather";
import analogClockController from "./analog-clock";
import notesController from "./notes";
import webSearchController from "./web-search";
import devUtilsController from "./dev-utils";
import systemInfoController from "./system-info";

class MainController {
  static instance: MainController | null = null

  #topContainer: HTMLElement
  #contentContainer: HTMLElement

  static getInstance() {
    if (!MainController.instance) {
      MainController.instance = new MainController()
    }

    return MainController.instance
  }


  init(){
    this.setContainers()

    sizeController.init()
    themeController.init()
    lockPositionController.init()
  }

  buildWidgets(){
    if(!this.#topContainer || !this.#contentContainer) {
      this.setContainers()
    }
    // Settings menu
    settingsMenuController.build(this.#topContainer)

    // Day Weather
    weatherController.build(this.#topContainer)

    // Analog clock
    analogClockController.build(this.#topContainer)

    // Widgets
    // Daily Weather
    weatherController.buildDaily(this.#contentContainer)

    // Web Search
    webSearchController.build(this.#contentContainer)

    // System Info
    systemInfoController.build(this.#contentContainer)

    // Dev Utils
    devUtilsController.build(this.#contentContainer)

    // Notes
    notesController.build(this.#contentContainer)
  }

  setContainers(){
    if(!this.#topContainer || !this.#contentContainer) {
      this.#topContainer = document.getElementById('top-container')
      this.#contentContainer = document.getElementById('content-container')
    }
  }

  onResume() {
    weatherController.updateAll()
    devUtilsController.update()
  }

  electronAPI(){
    // Listen for widgets resize event
    window.electronAPI.onWidgetsResize((_event, size) => {
      sizeController.setWidgetsSize(size)
    })

    window.electronAPI.onPowerMonitorEvent((_event, name) => {
      if(name === 'resume') {
        this.onResume()
      }
    })
  }

}

export type { MainController }
const mainController = MainController.getInstance()
export default mainController