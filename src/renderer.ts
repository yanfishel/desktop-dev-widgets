import {getWidgetsSettings} from "./utils/widgets-settings";

import './styles/main.css';

import lockPositionController from "./controllers/lock-position";
import themeController from "./controllers/theme";
import analogClockController from "./controllers/analog-clock";
import weatherController from "./controllers/weather";
import notesController from "./controllers/notes";
import settingsMenuController from "./controllers/settings-menu";
import sizeController from "./controllers/widgets-size";



document.addEventListener('DOMContentLoaded', () => {

  const widgetsSettings = getWidgetsSettings()

  const topContainer = document.getElementById('top-container')
  const contentContainer = document.getElementById('content-container')

  sizeController.init()
  themeController.init()
  lockPositionController.init()

  // Settings menu
  settingsMenuController.build(topContainer)

  // Day Weather
  weatherController.build(topContainer)

  // Analog clock
  analogClockController.build(topContainer)

  // Daily Weather
  weatherController.buildDaily(contentContainer)

  // Notes
  notesController.build(contentContainer)

})

window.electronAPI.onWidgetsResize((_event, size) => {
  sizeController.setWidgetsSize(size)
})



