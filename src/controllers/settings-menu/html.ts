import {aboutIcon, closeIcon, settingsIconHover, settingsIconRegular} from "../../assets";

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


export const settingsFooterHtml =  `
<div class="footer-content">
  <a href="#">${ aboutIcon } About</a>
</div>`


export const settingsMenuFooterHtml = (data: { version:string, productName:string, author:any, repository:any } ) => {
  return `
<div class="footer-content">
  <div class="author">
    ${ data.productName } v${ data.version ?? '0' }
    ${ data.repository?.url ? `<a href="${ data.repository.url }">@${ data.author?.name ?? '' }</a>` : `@${ data.author?.name ?? '' }` }
  </div>
</div>`
}