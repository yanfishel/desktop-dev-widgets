import {copyIconHover, copyIconRegular, dragItemIcon, trashIconHover, trashIconRegular} from "@assets";

export const notesWidgetHtml = `
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
    <div class="notes-view"></div>
    <textarea></textarea>
  </div>`

export const settingsMenuNotesHtml = `
  <div class="menu-item-handle">${ dragItemIcon }</div>
  <label for="notes-active">Notes</label>
  <div class="switch-container">
    <input type="checkbox" id="notes-active" name="notes-active" role="switch">
  </div>`