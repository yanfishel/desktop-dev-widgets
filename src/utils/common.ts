
// Wait function
export const wait = (s: number) => new Promise(resolve => setTimeout(resolve, s * 1000));

// Debounce function
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 B'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export const formatBytesMetric = (bytes:number, decimals = 2) => {
  if (!+bytes) return '0 B'

  const base = 1024; // Base for conversion between units
  const dm = decimals < 0 ? 0 : decimals; // Ensure decimals is not negative

  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  // Calculate the appropriate unit index
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(base));

  // Ensure the unit index doesn't exceed the available units
  const safeUnitIndex = Math.min(unitIndex, units.length - 1);

  const formattedSize = (bytes / Math.pow(base, safeUnitIndex)).toFixed(dm);

  return `${parseFloat(formattedSize)} ${units[safeUnitIndex]}`;
}