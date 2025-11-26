import {DATE_FORMAT_STANDARTS} from "../../../constants";
import {copyIconHover, copyIconRegular} from "../../../assets";


export const dateTimeTabHtml = `
  <div class="date-time-container">
  
    <table class="current-time">
      <tr>
        <td>Unix Seconds:</td>
        <td><input type="text" name="current-seconds" readonly /></td>
        <td>
          <div title="Copy to clipboard" data-copy="current-seconds" class="circle-button copy-button">
            ${ copyIconRegular }
            ${ copyIconHover }
          </div>
        </td>
      </tr>
      <tr>
        <td>Unix Milliseconds:</td>
        <td><input type="text" name="current-milliseconds" readonly /></td>
        <td>
          <div title="Copy to clipboard" data-copy="current-milliseconds" class="circle-button copy-button">
            ${ copyIconRegular }
            ${ copyIconHover }
          </div></div>
        </td>
      </tr>
    </table>
    
    <table class="convert-time">
      <tr>
        <td>Seconds</td>
        <td>Milliseconds</td>
      </tr>
      <tr>
        <td><input type="text" name="seconds" /><span></span></td>
        <td><input type="text" name="milliseconds" /><span></span></td>
        <td rowspan="2">
          <button>Now</button>
        </td>
      </tr>
    </table>
    
    <table class="convert-time time-zone-select">
      <tr>
        <td>Time zone</td>
        <td>
          <select name="time-zone"></select>
        </td>
      </tr>
    </table>
    
    <table class="convert-date">
      <tr>
        <td>Year</td>
        <td>Month</td>
        <td>Day</td>
      </tr>
      <tr>
        <td><input type="text" name="year" /><span></span></td>
        <td><input type="text" name="month" /><span></span></td>
        <td><input type="text" name="day" /><span></span></td>
      </tr>
      <tr>
        <td>Hour</td>
        <td>Minute</td>
        <td>Second</td>
      </tr>
      <tr>
        <td><input type="text" name="hour" /><span></span></td>
        <td><input type="text" name="minute" /><span></span></td>
        <td><input type="text" name="second" /><span></span></td>
      </tr>
    </table>
    
    <p class="help-text"></p>
    
    <table class="convert-time">
      <tr>
        <td rowspan="2">
          <label for="standart-formats">Format</label>
        </td>
        <td rowspan="2">
          <select id="standart-formats" name="standart-formats">
            ${ DATE_FORMAT_STANDARTS.map(format => `<option value="${format.name}">${format.label}</option>`).join('') }
          </select>
        </td>
        <td style="text-align: right;padding-bottom: 2px">
          <label for="add-offset">Offset</label>
          <input id="add-offset" type="checkbox" name="add-offset" role="switch" />
        </td>
      </tr>
      <tr>
        <td style="text-align: right;padding-top: 2px">
          <label for="add-time-zone">Time zone</label>
          <input id="add-time-zone" type="checkbox" name="add-time-zone" role="switch" />
        </td>
      </tr>
    </table>
    
    <table class="date-time-result">
      <tr>
        <td><input type="text" name="date-time-string" readonly /></td>
        <td>
          <div title="Copy to clipboard" data-copy="date-time-string" class="circle-button copy-button">
            ${ copyIconRegular }
            ${ copyIconHover }
          </div></div>
        </td>
      </tr>
    </table>
    
  </div>`