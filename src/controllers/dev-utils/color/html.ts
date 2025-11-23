import {copyIconHover, copyIconRegular} from "../../../assets";

export const colorTabHtml = `
  <div class="color-container">
    
    <input type="color" name="color-picker" value="#ff0000" alpha />
    
    
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
    </table>
    
  </div>`