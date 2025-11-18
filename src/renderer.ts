import './styles/main.css';
import './styles/tabs.css';

import mainController from "./controllers/main-controller";


document.addEventListener('DOMContentLoaded', () => {

  mainController.init()

  mainController.buildWidgets()

  mainController.electronAPI()

})
