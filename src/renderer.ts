import {getWidgetsSettings} from "./utils/widgetsSettings";

import './styles/main.css';

import lockPositionController from "./controllers/lockPosition";
import themeController from "./controllers/theme";
import analogClockController from "./controllers/analogClock";
import weatherController from "./controllers/weather";
import notesController from "./controllers/notes";
import settingsMenuController from "./controllers/settingsMenu";



document.addEventListener('DOMContentLoaded', () => {

  const widgetsSettings = getWidgetsSettings()

  const topContainer = document.getElementById('top-container')
  const contentContainer = document.getElementById('content-container')

  weatherController.init()

  themeController.init()
  lockPositionController.init()

  // Settings menu
  settingsMenuController.build(topContainer)

  // Day Weather
  weatherController.build(topContainer)

  // Analog clock
  analogClockController.build(topContainer)

  // Notes
  notesController.build(contentContainer)

})



