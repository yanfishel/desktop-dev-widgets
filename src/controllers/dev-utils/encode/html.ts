import {copyIconHover, copyIconRegular, downloadIcon, dropIcon, trashIconHover, trashIconRegular} from "../../../assets";

export const encodeTabHtml = `
  <div class="container encode-container">
    
      <div class="control-bar">
      
        <div class="title">Decoded</div>
               
        <div class="encode-type-container">
          <select name="encode-type">
            <optgroup label="Text">
              <option value="JWT">JSON Web Token (JWT)</option>
              <option value="URL">URL</option>
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
          <div title="Copy" data-copy="decoded-text" class="circle-button copy-button">
            ${ copyIconRegular }
            ${ copyIconHover }
          </div>
          <div title="Clear" data-clear="decoded-text" class="circle-button danger-button clear-button">
            ${ trashIconRegular }
            ${ trashIconHover }
          </div>
        </div>
        
        <div class="file-error-message">File decode error</div>
        <div class="decoded-file-container"></div>
        
        <div class="drag-zone">
          <div class="placeholder">${ dropIcon } Drop file to encode</div>
          <input type="file" id="file-input" style="display: none;">
        </div>
        
        <div class="input-area decoded-jwt-header-editable" 
              spellcheck="false" 
              contenteditable="true" 
              data-placeholder-jwt="- JWT header" 
              data-errormessage="JWT Header Token Invalid">
        </div>
        <div class="input-area decoded-text-editable language-json" 
              spellcheck="false" 
              contenteditable="true" 
              data-placeholder-jwt="- JWT claim" 
              data-placeholder-url="- URL" 
              data-errormessage="JWT Token Invalid">
        </div>
        
      </div>
      
      <div class="title">Encoded</div>
      
      <div class="encoded-container">
      
        <!--// Action Bar-->
        <div class="action-bar">
          <div title="Copy" data-copy="encoded-text" class="circle-button copy-button">
            ${ copyIconRegular }
            ${ copyIconHover }
          </div>
          <div title="Clear" data-clear="encoded-text" class="circle-button danger-button clear-button">
            ${ trashIconRegular }
            ${ trashIconHover }
          </div>
        </div>
        
        <div class="input-area encoded-text-editable" 
            spellcheck="false" contenteditable="true" 
            data-placeholder-jwt="- JWT Token" 
            data-placeholder-url="- Encoded URL" 
            data-placeholder-file="- Encoded File" 
            data-errormessage="Invalid JSON">
        </div>
        
<!--        <div class="input-area encoded-file-text-editable" spellcheck="false" contenteditable="true"></div>-->
        
      </div>
      
      <div class="signature-container">
        <div class="signature-button">Signature</div>
        <div class="signature-modal">
          <label>Sekret key</label>
          <input type="text" name="signature-secret" />
        </div>
      </div>
      
      <!--// - Cear All Action Bar -->
      <div class="action-bar clear-all">
        <div title="Clear All" data-clear="all" class="circle-button danger-button clear-button">
          ${ trashIconRegular }
          ${ trashIconHover }
        </div>
      </div>
   
  </div>`