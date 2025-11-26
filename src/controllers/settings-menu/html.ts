import {closeIcon, settingsIconHover, settingsIconRegular} from "../../assets";

export const settingsContainerHtml = `
  <div class="circle-button settings-menu-open">
    ${ settingsIconRegular }
    ${ settingsIconHover }
  </div>
  <div class="container settings-menu" style="display:none">
    <div class="circle-button settings-menu-close">
      ${ closeIcon }
    </div>
    <h1 style="padding-top: 16px;">Settings</h1>
  </div>`
