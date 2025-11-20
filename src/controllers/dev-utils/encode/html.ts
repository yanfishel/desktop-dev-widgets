import {copyIconHover, copyIconRegular, dropIcon, trashIconHover, trashIconRegular} from "../../../assets";

export const encodeTabHtml = `
  <div class="container" style="padding-left:0;padding-bottom:0">
    
    <div class="encode-container">
      <div class="control-bar">
        
        <div class="encode-type-container">
          <select name="encode-type">
            <option value="JWT">JSON Web Token (JWT)</option>
            <option value="base64">Base64</option>
            <option value="base32">Base32</option>
            <option value="url">URL</option>
          </select>         
        </div>
        
      </div>
      <div class="decoded-container">
      
        <!--// Action Bar-->
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
    
        <div class="drag-zone">
          <div class="placeholder">${ dropIcon } Drop file here</div>
          <input type="file" id="file-input" style="display: none;">
        </div>
      </div>
      <div class="encoded-container">
      
        <!--// Action Bar-->
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
        
        <textarea></textarea>
      </div>
    </div>
   
  </div>`