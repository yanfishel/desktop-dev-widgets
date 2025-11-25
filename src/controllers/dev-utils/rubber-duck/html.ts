import {closeIcon, helpIconHover, helpIconRegular, lightOnIcon} from "@assets";

export const rubberDuckTabHtml = `
  <div class="rubber-duck-container">
    <div id="filter-button" title="On/Off Duck" class="circle-button">
      ${ lightOnIcon }
    </div>
    <div id="info-button" title="Read info" class="circle-button">
      ${ helpIconRegular }
      ${ helpIconHover }
    </div>
    <div class="rubber-duck-image"></div>
    <div class="rubber-duck-info">
        <button class="close-info-button">${ closeIcon }</button>
        <p><b>Rubber duck debugging</b> (or rubberducking) is a debugging technique in software engineering. 
        A programmer explains their code, step by step, in natural language - either aloud or in writing - to reveal mistakes and misunderstandings.</p>
        <p style="text-align:right;padding-top:3px;font-size: 95%">
          <span class="external-link" data-url="https://rubberduckdebugging.com/">Official site</span> 
          <span class="external-link" data-url="https://en.wikipedia.org/wiki/Rubber_duck_debugging">Wikipedia</span>
        </p>
    </div>
  </div>`