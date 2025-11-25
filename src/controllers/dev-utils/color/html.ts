import {copyIconHover, copyIconRegular} from "@assets";

export const colorTabHtml = `
  <div class="color-container">
    
    
    
    <div class="color-input-container">
      
      <div class="color-input">
      
        <div class="color-preview">
          <div class="color-preview-top"></div>
          <div class="color-preview-bottom"></div>
        </div>
        <input type="color" name="color-picker" alpha />
      </div>
       
       <div class="color-form">
        
        <div class="color-form-row">
          <label for="input-hex">#</label>
          <input type="text" name="input-hex" id="input-hex" />
        </div>
         
        <div class="color-form-row">
          <label for="input-r">R</label>
          <input type="number" min="0" max="255" step="1" name="input-r" id="input-r" />
          <label for="input-g">G</label>
          <input type="number" min="0" max="255" step="1" name="input-g" id="input-g" />
          <label for="input-g">B</label>
          <input type="number" min="0" max="255" step="1" name="input-b" id="input-b" />
          <label for="input-g">A</label>
          <input type="number" min="0" max="100" step="1" name="input-a" id="input-a" />
        </div>
         
        <div class="color-form-row">
          <div class="color-alpha-slider">
            <input type="range" name="input-alpha" min="0" max="1" step="0.01" id="input-alpha" />
          </div>
        </div>
         
      </div>
       
    </div>
    
    <div class="color-error">
      <p>Color format Invalid</p>
    </div>
    
    <table class="color-result">
      <tr>
        <td><input type="text" name="color-hex" readonly /></td>
        <td>
          <div title="Copy to clipboard" 
               data-copy="color-hex" 
               class="circle-button copy-button">
            ${ copyIconRegular }
            ${ copyIconHover }
          </div>
        </td>
      </tr>
      <tr>
        <td><input type="text" name="color-hexa" readonly /></td>
        <td>
          <div title="Copy to clipboard" 
               data-copy="color-hexa" 
               class="circle-button copy-button">
            ${ copyIconRegular }
            ${ copyIconHover }
          </div>
        </td>
      </tr>
      <tr>
        <td><input type="text" name="color-rgb" readonly /></td>
        <td>
          <div title="Copy to clipboard" 
               data-copy="color-rgb" 
               class="circle-button copy-button">
            ${ copyIconRegular }
            ${ copyIconHover }
          </div>
        </td>
      </tr>
      <tr>
        <td><input type="text" name="color-rgba" readonly /></td>
        <td>
          <div title="Copy to clipboard" 
               data-copy="color-rgba" 
               class="circle-button copy-button">
            ${ copyIconRegular }
            ${ copyIconHover }
          </div>
        </td>
      </tr>
      <tr>
        <td><input type="text" name="color-hsl" readonly /></td>
        <td>
          <div title="Copy to clipboard" 
               data-copy="color-hsl" 
               class="circle-button copy-button">
            ${ copyIconRegular }
            ${ copyIconHover }
          </div>
        </td>
      </tr>
      <tr>
        <td><input type="text" name="color-hsla" readonly /></td>
        <td>
          <div title="Copy to clipboard" 
               data-copy="color-hsla" 
               class="circle-button copy-button">
            ${ copyIconRegular }
            ${ copyIconHover }
          </div>
        </td>
      </tr>
      <tr>
        <td><input type="text" name="color-hwb" readonly /></td>
        <td>
          <div title="Copy to clipboard" 
               data-copy="color-hwb" 
               class="circle-button copy-button">
            ${ copyIconRegular }
            ${ copyIconHover }
          </div>
        </td>
      </tr>
      <tr>
        <td><input type="text" name="color-hwba" readonly /></td>
        <td>
          <div title="Copy to clipboard" 
               data-copy="color-hwba" 
               class="circle-button copy-button">
            ${ copyIconRegular }
            ${ copyIconHover }
          </div>
        </td>
      </tr>
    </table>
    
  </div>`
