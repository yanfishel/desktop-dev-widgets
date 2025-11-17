import {copyIconHover, copyIconRegular, trashIconHover, trashIconRegular} from "../../assets";

export const notesWidgetHtml = `
  <div class="container">
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
    <div class="notes-view"></div>
    <textarea></textarea>
  </div>`