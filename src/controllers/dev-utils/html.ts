import {copyIconHover, copyIconRegular, dateTimeTabIcon, duckTabIcon, helpIconHover, helpIconRegular, lightOnIcon, trashIconHover, trashIconRegular} from "../../assets";

export const devUtilsHtml = `
  <div class="container">    
    <div class="tabs">
        
      <!--TABS-->  
      <input type="radio" id="tab1" name="tab-control" checked>
      <input type="radio" id="tab2" name="tab-control">
      <input type="radio" id="tab3" name="tab-control">  
      <ul>
        <li title="Rubber Duck">
          <label for="tab1" role="button" class="home-tab">
            ${ duckTabIcon }
          </label>
        </li>
        <li title="Date & Time">
          <label for="tab2" role="button">
            ${ dateTimeTabIcon }
            <span>Date &amp; Time</span>
          </label>
        </li>
        <li title="Encode">
          <label for="tab3" role="button">
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M3,4A2,2 0 0,0 1,6V17H3A3,3 0 0,0 6,20A3,3 0 0,0 9,17H15A3,3 0 0,0 18,20A3,3 0 0,0 21,17H23V12L20,8H17V4M10,6L14,10L10,14V11H4V9H10M17,9.5H19.5L21.47,12H17M6,15.5A1.5,1.5 0 0,1 7.5,17A1.5,1.5 0 0,1 6,18.5A1.5,1.5 0 0,1 4.5,17A1.5,1.5 0 0,1 6,15.5M18,15.5A1.5,1.5 0 0,1 19.5,17A1.5,1.5 0 0,1 18,18.5A1.5,1.5 0 0,1 16.5,17A1.5,1.5 0 0,1 18,15.5Z" />
              </svg>
            <span>Encode</span>
          </label>
        </li>    
      </ul>
      
      <!--TAB CONTENTS-->
      <div class="content">
      
      </div>
    </div>
    
  </div>`


export const rubberDuckTabHtml = `
  <div class="rubber-duck-container">
    <div id="filter-button" title="On/Off Duck" class="circle-button">
      ${ lightOnIcon }
    </div>
    <div id="rubber-duck-info-button" title="Read info" class="circle-button">
      ${ helpIconRegular }
      ${ helpIconHover }
    </div>
    <div class="rubber-duck-image"></div>
  </div>`

export const dateTimeTabHtml = `
  <div class="date-time-container">
    
  </div>`

export const encodeTabHtml = `
  <div class="container encode-container">
    <!--// Action Bar-->
    <div class="acction-bar">
      <div class="circle-button copy-button">
        ${ copyIconRegular }
        ${ copyIconHover }
      </div>
      <div class="circle-button danger-button clear-button">
        ${ trashIconRegular }
        ${ trashIconHover }
      </div>
    </div>
    
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea dolorem sequi, quo tempore in eum obcaecati atque quibusdam officiis est dolorum minima deleniti ratione molestias numquam. Voluptas voluptates quibusdam cum?
  </div>`