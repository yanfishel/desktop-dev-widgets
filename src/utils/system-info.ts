import {NETWORK_SPEED_LABELS, NETWORK_SPEED_STEPS} from "../constants";

// Get max value of network speed
export const networkChartMaxValue = (rxSec:number[], txSec:number[]) => {

  let maxValue = NETWORK_SPEED_STEPS[0]
  let maxLabel = NETWORK_SPEED_LABELS[0]
  const max_speed_rec = rxSec.reduce((prev, curr) => Math.max(prev, curr), 0)
  const max_speed_trans = txSec.reduce((prev, curr) => Math.max(prev, curr), 0)
  const max_speed = Math.max(max_speed_rec, max_speed_trans)
  for (let i = 1; i < NETWORK_SPEED_STEPS.length; i++) {
    if(max_speed < NETWORK_SPEED_STEPS[i] && max_speed > NETWORK_SPEED_STEPS[i-1]){
      maxValue = NETWORK_SPEED_STEPS[i]
      maxLabel = NETWORK_SPEED_LABELS[i]
    }
  }
  return {
    maxValue,
    maxLabel
  }
}