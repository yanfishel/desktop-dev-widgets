import {copyIconHover, copyIconRegular, dragItemIcon, spinnerIcon, trashIconHover, trashIconRegular} from "../../assets";


export const mockServerWidgetHtml = `
<div class="container">
  <div class="action-bar">
    <div class="circle-button copy-button">
      ${ copyIconRegular }
      ${ copyIconHover }
    </div>
    <div class="circle-button danger-button clear-button">
      ${ trashIconRegular }
      ${ trashIconHover }
    </div>
  </div>
  
  <input type="number" step="1" min="0" name="mock-server-port" />
  <button type="button" class="test-button">test</button>
  <button type="button" class="start-button">start</button>
  <button type="button" disabled class="stop-button">stop</button>
  
  
  <div class="loader">${ spinnerIcon }</div>
</div>`

export const settingsMenuMockServerHtml = `
  <div class="menu-item-handle">${ dragItemIcon }</div>
  <label for="mock-server-active">Mock server</label>
  <div class="switch-container">
    <input type="checkbox" id="mock-server-active" name="mock-server-active" role="switch">
  </div>`