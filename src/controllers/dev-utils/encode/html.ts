import {copyIconHover, copyIconRegular, downloadIcon, downloadIconHover, downloadIconRegular, dropIcon, trashIconHover, trashIconRegular} from "../../../assets";

export const encodeTabHtml = `
  <div class="container" style="padding-left:0;padding-bottom:0">
    
    <div class="encode-container">
      
      <div class="control-bar">
      
        <div class="title">Decoded</div>
               
        <div class="encode-type-container">
          <select name="encode-type">
            <optgroup label="Text">
              <option value="JWT">JSON Web Token (JWT)</option>
              <option value="url">URL</option>
            </optgroup>
            <optgroup label="File">
              <option value="base64">Base64</option>
              <option value="base32">Base32</option>
            </optgroup>
          </select>         
        </div>
        
      </div>
      
      <div class="decoded-container">
      
        <!--// Action Bar-->
        <div class="action-bar">
          <div title="Download file" class="circle-button download-button">
            ${ downloadIcon }
          </div>
          <div title="Copy" class="circle-button copy-button">
            ${ copyIconRegular }
            ${ copyIconHover }
          </div>
          <div title="Clear" class="circle-button danger-button clear-button">
            ${ trashIconRegular }
            ${ trashIconHover }
          </div>
        </div>
        
        <div class="decoded-file-container"></div>
        
        <div class="drag-zone">
          <div class="placeholder">${ dropIcon } Drop file to encode</div>
          <input type="file" id="file-input" style="display: none;">
        </div>
        
<!--        <textarea name="decoded-text-input" placeholder="Decoded text here"></textarea>-->
        <div class="decoded-text-editable" contenteditable="true"></div>
        
      </div>
      
      <div class="title">Encoded</div>
      
      <div class="encoded-container">
      
        <!--// Action Bar-->
        <div class="action-bar">
          <div title="Copy" class="circle-button copy-button">
            ${ copyIconRegular }
            ${ copyIconHover }
          </div>
          <div title="Clear" class="circle-button danger-button clear-button">
            ${ trashIconRegular }
            ${ trashIconHover }
          </div>
        </div>
        
        <textarea name="encoded-text-output" placeholder="Encoded text here"></textarea>
        <textarea name="encoded-file-text-output" placeholder="Encoded text here"></textarea>
      </div>
      
      <!--// - Cear All Action Bar -->
      <div class="action-bar clear-all">
        <div title="Clear All" class="circle-button danger-button clear-button">
          ${ trashIconRegular }
          ${ trashIconHover }
        </div>
      </div>
      
    </div>
   
  </div>`