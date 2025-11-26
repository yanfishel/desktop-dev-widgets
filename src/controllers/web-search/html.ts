import {SEARCH_ENGINES} from "../../constants";
import {searchIcon} from "../../assets";

export const webSearchHtml = `<div class="container">
  <div class="web-search-container">
    
    <img src="${ SEARCH_ENGINES[0].icon }" alt="" class="search-engine-icon">
    
    <select name="web-search-engine">
      ${ SEARCH_ENGINES.map(engine => `<option value="${engine.name}">${engine.name}</option>`).join('') }
    </select>
    
    <input type="text" name="web-search-input" class="web-search-input" placeholder="Search..." />
    
    <div class="search-icon">${ searchIcon }</div>
   
  </div>
</div>`

export const settingsMenuWebSearchHtml = `
  <label for="web-search-avtive">Web search</label>
  <div class="switch-container">
    <input type="checkbox" id="web-search-avtive" name="web-search-avtive" role="switch">
  </div>`