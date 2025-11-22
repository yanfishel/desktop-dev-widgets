import './styles/main.css';
import './styles/tabs.css';
import './styles/form.css';

import mainController from "./controllers/main-controller";


document.addEventListener('DOMContentLoaded', () => {

  mainController.init()

  mainController.buildWidgets()

  mainController.electronAPI()

})

// Paste plain text from clipboard to contenteditable div
document.addEventListener("paste", function(e) {
  // Prevent the default paste behavior (which might include formatting)
  e.preventDefault();

  // Get the plain text content from the clipboard
  let content = '';
  if (e.clipboardData) {
    content = e.clipboardData.getData('text/plain');
  } else if ((window as any).clipboardData) { // For older IE versions
    content = (window as any).clipboardData.getData('Text');
  }

  // Insert the plain text content into the editable area
  // This assumes the paste target is an element where text can be inserted
  // like a contenteditable div or an input/textarea.
  document.execCommand('insertText', false, content);
});