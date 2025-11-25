
import {formatBytes, formatBytesMetric, getWidgetsSettings} from "../../utils";
import {diskUsageItemHtml, systemInfoHtml} from "./html";
import "./style.css"
import {Systeminformation} from "systeminformation";
import {ethernetIcon, wifiIcon} from "../../assets";


class SystemInfo {
  static instance: SystemInfo | null = null

  #started = false
  #cpuPercents: number[] = [0,0,0,0,0,0,0,0,0,0,0]
  #ramPercents: number[] = [0,0,0,0,0,0,0,0,0,0,0]
  #rxSec: number[] = [0,0,0,0,0,0,0,0,0,0,0]
  #txSec: number[] = [0,0,0,0,0,0,0,0,0,0,0]

  #cpuStatus: HTMLElement
  #cpuChart: HTMLElement
  #cpuPercent: HTMLElement
  #ramStatus: HTMLElement
  #ramChart: HTMLElement
  #ramPercent: HTMLElement

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

    const elem = document.createElement('div')
    elem.id = 'system-info-widget'
    elem.style.order = settings.systemInfo.order+''
    elem.style.display = settings.systemInfo.active ? 'block' : 'none'
    elem.innerHTML = systemInfoHtml

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

    this.getDiskUsage()

    container.appendChild(elem)
  }

  private start(){
    this.#started = true
    this.update()
  }

  private stop() {
    this.#started = false
  }

  private update(){
    this.getCpuUsage()
    this.getNetworkUsage()
    if(this.#started) {
      setTimeout(()=>this.update(), 3_000)
    }
  }

  private async getNetworkUsage(){
    const result = await window.electronAPI.getNetworkStatsInfo()
    let rx_sec = 0, tx_sec = 0
    if(result.stats) {
      result.stats.forEach(item => {
        rx_sec += +(item.rx_sec * 8 / 1000).toFixed(2)
        tx_sec += +(item.tx_sec * 8 / 1000).toFixed(2)
      })
      
      this.#rxSec.push(rx_sec)
      this.#txSec.push(tx_sec)
      if(this.#rxSec.length > 11) this.#rxSec.shift()
      if(this.#txSec.length > 11) this.#txSec.shift()
    }
    if(result.iface) {
      this.#netIfaceInfo.classList.remove('state-up', 'state-down')
      let html = ``
      html += `<p><span>${ result.iface.iface }</span>${ result.iface.type === 'wireless' ? wifiIcon : ethernetIcon }</p>`
      html += `<p>${ result.iface.ip4 }</p>`
      this.#netIfaceInfo.innerHTML = html
      this.#netIfaceInfo.classList.add(`state-${result.iface.operstate}`)
    }
    this.upddateNetworkUsage()
  }

  private upddateNetworkUsage(){
    const steps = [500, 1_000, 10_000, 50_000, 100_000, 250_000, 500_000, 1_000_000]
    const stepsLabels = ['500Kbps', '1Mbps', '10Mbps', '50Mbps', '100Mbps', '250Mbps', '500Mbps', '1Gbps']
    let index = 0
    let maxValue = steps[0]
    let maxLabel = stepsLabels[0]
    const max_speed = this.#rxSec.reduce((prev, curr) => Math.max(prev, curr), 0)
    for (let i = 1; i < steps.length; i++) {
      if(max_speed < steps[i] && max_speed > steps[i-1]){
        maxValue = steps[i]
        maxLabel = stepsLabels[i]
        index = i
      }
    }
    if(maxValue > max_speed/2 && index < steps.length - 1) {
      maxValue = steps[index+1]
    }

    this.#netChartsLabel.innerHTML = maxLabel
    
    const transferPolygon = `polygon(0 100%, ${ this.#rxSec.map((sec, i)=> `${i*10}% ${ (100 - sec / maxValue *100).toFixed(2) }%`).join(', ') }, 100% 100%)`
    this.#netTransferChart.style.clipPath = transferPolygon
    const receivePolygon = `polygon(0 100%, ${ this.#txSec.map((sec, i)=> `${i*10}% ${ (100 - sec / maxValue *100).toFixed(2) }%`).join(', ') }, 100% 100%)`
    this.#netReceiveChart.style.clipPath = receivePolygon
  }

  private async getCpuUsage(){
    const result = await window.electronAPI.getSystemInfo()
    if(result.info) {
      const cpuPercent = result.info.currentLoad.toFixed(2)
      this.#cpuStatus.innerHTML = `${result.info.cpus.length} cores`
      //this.#cpuStatus.innerHTML = `${cpuPercent}%`
      this.#cpuPercent.innerHTML = `${cpuPercent}%`
      this.#cpuPercents.push(cpuPercent)
      if(this.#cpuPercents.length > 11) this.#cpuPercents.shift()
    }
    if(result.memory) {
      const ramTotal = formatBytesMetric(result.memory.total)
      const ramUsed = formatBytesMetric(result.memory.used)
      const ramPercent = +(result.memory.used / result.memory.total * 100).toFixed(2)
      this.#ramStatus.innerHTML = `${ramTotal}`
      //this.#ramStatus.innerHTML = `${ramUsed} / ${ramTotal} (${ramPercent}%)`
      this.#ramPercent.innerHTML = `${ramPercent}%`
      this.#ramPercents.push(ramPercent)
      if(this.#ramPercents.length > 11) this.#ramPercents.shift()
    }
    this.updateCpuUsage()
  }

  private updateCpuUsage(){
    const cpuPolygon = `polygon(0 100%, ${ this.#cpuPercents.map((perc, i)=> `${i*10}% ${100-perc}%`).join(', ') }, 100% 100%)`
    this.#cpuChart.style.clipPath = cpuPolygon
    const ramPolygon = `polygon(0 100%, ${ this.#ramPercents.map((perc, i)=> `${i*10}% ${100-perc}%`).join(', ') }, 100% 100%)`
    this.#ramChart.style.clipPath = ramPolygon
  }

  private async getDiskUsage(){
    const diskUsage = await window.electronAPI.getDiskUsage()
    this.updateDiskUsage(diskUsage)
  }

  private updateDiskUsage(data:Systeminformation.FsSizeData[]){
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