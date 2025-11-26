import './styles/main.css';
import './styles/tabs.css';
import './styles/form.css';

import mainController from "./controllers/main-controller";


document.addEventListener('DOMContentLoaded', () => {

  //alert('Hello World from Renderer!')

    mainController.init()

    mainController.buildWidgets()

    mainController.electronAPI()

})

