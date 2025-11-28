import {dialog, shell} from "electron";
import {currentLoad, fsSize, mem, networkInterfaces, networkStats} from "systeminformation";

export const openExternalLink = async (url:string) => {
   try {
    await shell.openExternal(url)
  } catch (error) {
    console.error('Error opening external link:', error)
    dialog.showErrorBox('Error opening external link', `${error}`)
  }
}

export const getPackageJson = async () => {
  try {
    const versions = ['electron', 'chrome', 'node', 'v8'].map(e => [e, process.versions[e]]);
    const packageJson:IPackageJson = await import('../../package.json')
    return { packageJson, versions }
  } catch (error) {
    console.error('Error getting app info:', error)
  }
}

export const getSystemInfo = async () => {
  try {
    const [info, memory] = await Promise.all([ currentLoad(), mem() ])
    return { info, memory }
  } catch (e) {
    console.log('Error get Load', e);
  }
}

export const getDiskUsage = async () => {
  try {
    return await fsSize()
  } catch (e) {
    console.log('Error get Disk usage', e);
  }
}

export const getNetworkStats = async () => {
  try {
    const [stats, iface] = await Promise.all([ networkStats(), networkInterfaces('default') ])
    return {stats, iface}
  } catch (e) {
    console.log('Error get Statistic', e);
  }
}

export const getPublicIP = async () => {
  try {
    const ip = await fetch('https://api.ipify.org?format=json').then(res => res.json())
    return ip.ip
  } catch (e) {
    console.log('Error get IP', e);
  }
}