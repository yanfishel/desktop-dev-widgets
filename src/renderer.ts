import {getWidgetsSettings} from "./utils/widgetsSettings";

import './styles/main.css';

import lockPositionController from "./controllers/lockPosition";
import themeController from "./controllers/theme";
import analogClockController from "./controllers/analogClock";
import notesController from "./controllers/notes";
import settingsMenuController from "./controllers/settingsMenu";



document.addEventListener('DOMContentLoaded', () => {

  const widgetsSettings = getWidgetsSettings()

  const topContainer = document.getElementById('top-container')
  const contentContainer = document.getElementById('content-container')

  themeController.init()
  lockPositionController.init()

  // Settings menu
  settingsMenuController.build(topContainer)

  // Analog clock
  analogClockController.build(topContainer)

  // Notes
  notesController.build(contentContainer)

})



