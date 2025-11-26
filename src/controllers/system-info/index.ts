import {Systeminformation} from "systeminformation";

import {ethernetIcon, wifiIcon} from "@assets";
import {getWidgetsSettings, formatBytesMetric, networkChartMaxValue, setWidgetsWidgetSetting} from "@utils";
import {diskUsageItemHtml, settingsMenuSysInfoHtml, systemInfoHtml} from "./html";
import "./style.css"


class SystemInfo {
  static instance: SystemInfo | null = null

  chartstep = 15
  updateInterval = 3_000

  #id: string
  #globalTimeinput: HTMLInputElement
  #started = false
  #processing = false
  #cpuPercents: number[] = new Array(this.chartstep).fill(0) // [0,0,0,0,0,0,0,0,0,0,0]
  #ramPercents: number[] = new Array(this.chartstep).fill(0)
  #rxSec: number[] = new Array(this.chartstep).fill(0)
  #txSec: number[] = new Array(this.chartstep).fill(0)

  #cpuStatus: HTMLElement
  #cpuChart: HTMLElement
  #cpuPercent: HTMLElement
  #ramStatus: HTMLElement
  #ramChart: HTMLElement
  #ramPercent: HTMLElement

  #publicIP = ''
  #networkIface = ''
  #netIfaceInfo: HTMLElement
  #netChartsLabel: HTMLElement
  #netTransferChart: HTMLElement
  #netReceiveChart: HTMLElement

  #diskUsageContainer: HTMLElement

  static getInstance() {
    if (!SystemInfo.instance) {
      SystemInfo.instance = new SystemInfo()
    }

    return SystemInfo.instance
  }

  build(container: HTMLElement){
    const settings = getWidgetsSettings()
    this.#id = settings.widgets.systemInfo.id
    const elem = document.createElement('div')
    elem.id = this.#id
    elem.style.order = settings.widgets.systemInfo.order+''
    elem.style.display = settings.widgets.systemInfo.active ? 'block' : 'none'
    elem.innerHTML = systemInfoHtml

    this.#globalTimeinput = document.getElementById('global-time') as HTMLInputElement

    this.#cpuStatus = elem.querySelector('#cpu-status')
    this.#cpuChart = elem.querySelector('#cpu-chart')
    this.#cpuPercent = elem.querySelector('#cpu-percent')
    this.#ramStatus = elem.querySelector('#ram-status')
    this.#ramChart = elem.querySelector('#ram-chart')
    this.#ramPercent = elem.querySelector('#ram-percent')

    this.#netIfaceInfo = elem.querySelector('.iface-info')
    this.#netChartsLabel = elem.querySelector('#data-charts-label')
    this.#netTransferChart = elem.querySelector('#chart-transfered')
    this.#netReceiveChart = elem.querySelector('#chart-received')

    this.#diskUsageContainer = elem.querySelector('#disk-usage')

    this.start()

    container.appendChild(elem)
  }

  public settingsMenuElement() {
    const settings = getWidgetsSettings()

    const element = document.createElement('div')
    element.classList.add('settings-menu-item')
    element.innerHTML = settingsMenuSysInfoHtml
    const checkbox:HTMLInputElement = element.querySelector('input[name="systeminfo-active"]')
    checkbox.checked = settings.widgets.systemInfo.active

    checkbox.addEventListener('change', (e:any)=> {
      document.getElementById(settings.widgets.systemInfo.id).style.display = e.target.checked ? 'block' : 'none'
      this.toggleActive(e.target.checked)
      setWidgetsWidgetSetting('systemInfo', {...settings.widgets.systemInfo, active: e.target.checked })
    })
    return element
  }

  public start(){
    this.#started = true
    this.getDiskUsage()
    this.update()
  }

  public stop() {
    this.#started = false
  }

  public toggleActive(active = true) {
    if(active) {
      this.start()
    }
    else this.stop()
  }

  private async update(){
    const settings = getWidgetsSettings()
    if(this.#processing || !settings.widgets.systemInfo.active) {
      return
    }
    this.#processing = true
    await Promise.all([
      this.getCpuRamStat(),
      this.getNetworkStat()
    ])
    // Update Disk Usage every minute
    const time = this.#globalTimeinput.value.split(':')
    const seconds = parseInt(time[2])
    if(seconds === 0){
      await this.getDiskUsage()
    }
    this.#processing = false
    if(this.#started) {
      setTimeout(()=>this.update(), this.updateInterval)
    }
  }

  private async getPublicIP(){
    const result = await window.electronAPI.getPublicIP()
    if(result) {
      this.#publicIP = result
    }
  }

  private async getNetworkStat(){
    if(!this.#publicIP) await this.getPublicIP()
    const result = await window.electronAPI.getNetworkStatsInfo()
    if(result.stats && result.iface) {
      const down = result.stats.every(item=>item.operstate === 'down')
      if(down || this.#networkIface !== result.iface.iface) {
        this.#publicIP = ''
      }
      this.#networkIface = result.iface.iface
      this.updateNetworkStat(result)
    }
  }

  private updateNetworkStat({stats, iface}: {stats: Systeminformation.NetworkStatsData[], iface: Systeminformation.NetworkInterfacesData }){
    let rx_sec = 0, tx_sec = 0
    stats.forEach(item => {
      rx_sec += +(item.rx_sec * 8 / 1000).toFixed(2)
      tx_sec += +(item.tx_sec * 8 / 1000).toFixed(2)
    })
    this.#rxSec.push(rx_sec)
    this.#txSec.push(tx_sec)
    if(this.#rxSec.length > this.chartstep) this.#rxSec.shift()
    if(this.#txSec.length > this.chartstep) this.#txSec.shift()

    this.#netIfaceInfo.classList.remove('state-up', 'state-down')
    let html = ``
    html += `<p><span>${ iface.iface }</span>${ iface.type === 'wireless' ? wifiIcon : ethernetIcon }</p>`
    html += this.#publicIP ? `<p>${ this.#publicIP }</p>` : ''
    html += `<p>${ iface.ip4 }</p>`
    this.#netIfaceInfo.innerHTML = html
    this.#netIfaceInfo.classList.add(`state-${iface.operstate}`)

    //Update Charts
    this.upddateNetworkChart()
  }

  private upddateNetworkChart(){
    const { maxValue, maxLabel } = networkChartMaxValue(this.#rxSec, this.#txSec)

    this.#netChartsLabel.innerHTML = maxLabel
    
    const transferPolygon = `polygon(0 100%, ${ this.#txSec.map((sec, i)=> `${i*(100/(this.chartstep-1))}% ${ (100 - sec / maxValue *100).toFixed(2) }%`).join(', ') }, 100% 100%)`
    this.#netTransferChart.style.clipPath = transferPolygon
    const receivePolygon = `polygon(0 100%, ${ this.#rxSec.map((sec, i)=> `${i*(100/(this.chartstep-1))}% ${ (100 - sec / maxValue *100).toFixed(2) }%`).join(', ') }, 100% 100%)`
    this.#netReceiveChart.style.clipPath = receivePolygon
  }

  private async getCpuRamStat(){
    const result = await window.electronAPI.getSystemInfo()
    if(result.info && result.memory) {
      this.updateCpuRamStatus(result)
    }
  }

  private updateCpuRamStatus({info, memory}: {info: Systeminformation.CurrentLoadData, memory: Systeminformation.MemData }){
    const cpuPercent = info.currentLoad.toFixed(1)
    this.#cpuStatus.innerHTML = `${info.cpus.length} cores`
    this.#cpuPercent.innerHTML = `${cpuPercent}%`
    this.#cpuPercents.push(+cpuPercent)
    if(this.#cpuPercents.length > this.chartstep) this.#cpuPercents.shift()

    const ramTotal = formatBytesMetric(memory.total, 1)
    const ramUsed = formatBytesMetric(memory.used)
    const ramPercent = +(memory.used / memory.total * 100).toFixed(1)
    this.#ramStatus.innerHTML = `${ramTotal}`
    this.#ramPercent.innerHTML = `${ramPercent}%`
    this.#ramPercents.push(ramPercent)
    if(this.#ramPercents.length > this.chartstep) this.#ramPercents.shift()

    // Update Charts
    this.updateCpuRamChart()
  }

  private updateCpuRamChart(){
    const cpuPolygon = `polygon(0 100%, ${ this.#cpuPercents.map((perc, i)=> `${i* (100/(this.chartstep-1))}% ${100-perc}%`).join(', ') }, 100% 100%)`
    this.#cpuChart.style.clipPath = cpuPolygon
    const ramPolygon = `polygon(0 100%, ${ this.#ramPercents.map((perc, i)=> `${i* (100/(this.chartstep-1))}% ${100-perc}%`).join(', ') }, 100% 100%)`
    this.#ramChart.style.clipPath = ramPolygon
  }

  private async getDiskUsage(){
    const settings = getWidgetsSettings()
    if(!settings.widgets.systemInfo.active) return
    const diskUsage = await window.electronAPI.getDiskUsage()
    this.updateDiskUsage(diskUsage)
  }

  private updateDiskUsage(data:Systeminformation.FsSizeData[]){
    if(!data) {
      this.#diskUsageContainer.innerHTML = '<p class="error">No data available</p>'
      return
    }
    let html = ''
    data.forEach(item => {
      html += diskUsageItemHtml(item)
    })
    this.#diskUsageContainer.innerHTML = html
  }

}

export type { SystemInfo }
const systemInfoController = SystemInfo.getInstance()
export default systemInfoController