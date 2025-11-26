import {Systeminformation} from "systeminformation";

import { formatBytesMetric } from "../../utils";
import {dragItemIcon} from "../../assets";

export const systemInfoHtml = `
  <div class="container">
  <div class="system-info-container">
    
    <div class="cpu-ram-status">
      
      <div class="status-container">
        <div class="title">CPU<div id="cpu-status"></div></div>
        <div class="chart-container">
          <div id="cpu-percent" class="percent"></div>
          <div id="cpu-chart" class="chart"></div>
        </div>
      </div>
      
      <div class="status-container">
        <div class="title">RAM<div id="ram-status"></div></div>
        <div class="chart-container">
          <div id="ram-percent" class="percent"></div>
          <div id="ram-chart" class="chart"></div>
          </div>
      </div>
    
    </div>
    
    <div class="system-disks-status">
      <div class="title">HDD</div>
      <div id="disk-usage"></div>
    </div>
    
    <div class="network-status">
      <div class="title">Network</div>
      
      <div class="iface-info"></div>
      
      <div title="Received bytes/sec" class="chart-container">
        <div id="data-charts-label"></div>
        <div class="down"></div>
        <div id="chart-received" class="chart"></div>
      </div>
      
      <div title="Transfered bytes/sec" class="chart-container">
        <div class="up"></div>
        <div id="chart-transfered" class="chart"></div>
      </div>
      
      
    </div>
    
    
  </div>
  </div>
`

export const diskUsageItemHtml = (fsData:Systeminformation.FsSizeData) => {
  const treshold = 85
  let usedWidth = `${ fsData.use }%`
  let errorWidth = `0%`
  const isError = fsData.use > treshold
  if(isError){
    usedWidth = `${ treshold }%`
    errorWidth = `${ fsData.use - treshold }%`
  }

  return `
<div class="disk-usage-item">
   <div class="disk-name">${ fsData.mount } <span>${ formatBytesMetric( fsData.size, 1 ) }</span></div>
   <div class="disk-percent">${ fsData.use }%</div>
   <div class="disk-used-progress">
     <div class="disk-used-bar" style="width:${ usedWidth }"></div>
     <div class="disk-used-bar-error" style="width:${ errorWidth }"></div>
  </div>
</div>`
}

export const settingsMenuSysInfoHtml = `
  <div class="menu-item-handle">${ dragItemIcon }</div>
  <label for="systeminfo-active">System Info</label>
  <div class="switch-container">
    <input type="checkbox" id="systeminfo-active" name="systeminfo-active" role="switch">
  </div>`