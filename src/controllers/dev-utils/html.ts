import {colorIcon, dateTimeIcon, dragItemIcon, duckIcon, encodeIcon} from "../../assets";


export const devUtilsHtml = `
  <div class="container">    
    <div class="tabs">
        
      <!--TABS-->  
      <input type="radio" id="tab1" name="tab-control" data-tab="encode" checked>
      <input type="radio" id="tab2" name="tab-control" data-tab="datetime">
      <input type="radio" id="tab3" name="tab-control" data-tab="color">
      <input type="radio" id="tab4" name="tab-control" data-tab="duck">  
      <ul>
        <li title="Encode / Decode">
          <label for="tab1" role="button">${ encodeIcon } <span>Encode</span></label>
        </li>
        <li title="Date & Time">
          <label for="tab2" role="button">${ dateTimeIcon } <span>Time</span></label>
        </li>
        <li title="Color">
          <label for="tab3" role="button" class="home-tab">${ colorIcon } <span>Color</span></label>
        </li>
        <li title="Rubber Duck">
          <label for="tab4" role="button" class="home-tab">${ duckIcon }</label>
        </li>
      </ul>
      
      <!--TAB CONTENTS-->
      <div class="content">
      
      </div>
    </div>
    
  </div>`


export const settingsMenuDevUtilsHtml = `
  <div class="menu-item-handle">${ dragItemIcon }</div>
  <label for="dev-utils">Dev Utils</label>
  <div class="switch-container">
    <input type="checkbox" id="dev-utils" name="dev-utils" role="switch">
  </div>`