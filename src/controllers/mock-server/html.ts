import {copyIconHover, copyIconRegular, dragItemIcon, endpointIcon, responseIcon, spinnerIcon, trashIconHover, trashIconRegular} from "../../assets";
import {DEFAULT_HOST} from "../../constants";


export const mockServerWidgetHtml = `
<div class="container">
   
  <div class="form-container">
    <label for="mock-server-port">http://${ DEFAULT_HOST }:</label>
    <input type="number" step="1" min="0" id="mock-server-port" name="mock-server-port" />
    <button type="button" class="test-button">test</button>
    <label for="mock-server-on-off">On/Off</label>
    <div class="switch-container">
      <input type="checkbox" id="mock-server-on-off" name="mock-server-on-off" role="switch">
    </div>
  </div>
  
  <!--TABS--> 
  <div class="tabs"> 
    <input type="radio" id="endpoints" name="server-tab-control" data-tab="endpoints" checked>
    <input type="radio" id="responses" name="server-tab-control" data-tab="responses">
    <ul>
      <li title="Endpoints">
        <label for="endpoints" role="button">${ endpointIcon } <span>Endpoints</span></label>
      </li>
      <li title="Responses">
        <label for="responses" role="button">${ responseIcon } <span>Responses</span></label>
      </li>
    </ul>
    
    <!--TAB CONTENTS-->
    <div class="content">
    
    </div>
  </div>
  
  
  <div class="loader">${ spinnerIcon }</div>
</div>`

export const settingsMenuMockServerHtml = `
  <div class="menu-item-handle">${ dragItemIcon }</div>
  <label for="mock-server-active">Mock server</label>
  <div class="switch-container">
    <input type="checkbox" id="mock-server-active" name="mock-server-active" role="switch">
  </div>`