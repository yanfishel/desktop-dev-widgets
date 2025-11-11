
import {getWidgetsSettings} from "./utils/widgetsSettings";

import settingsMenu from "./components/settings-menu";
import './components/settings-menu/style.css'

import analogClock from './components/analog-clock'
import './components/analog-clock/style.css'

import './styles/main.css';



const widgetsSettings = getWidgetsSettings()

console.log('renderer.ts', widgetsSettings)

document.addEventListener('DOMContentLoaded', () => {

  const topContainer = document.getElementById('top-container')

  // Settings menu
  settingsMenu.build(topContainer)

  // Analog clock
  analogClock.build(topContainer)

})



