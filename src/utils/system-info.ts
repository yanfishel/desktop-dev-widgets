import {NETWORK_SPEED_LABELS, NETWORK_SPEED_STEPS} from "@constants";

export const networkChartMaxValue = (rxSec:number[], txSec:number[]) => {
  let index = 0
  let maxValue = NETWORK_SPEED_STEPS[0]
  let maxLabel = NETWORK_SPEED_LABELS[0]
  const max_speed_rec = rxSec.reduce((prev, curr) => Math.max(prev, curr), 0)
  const max_speed_trans = txSec.reduce((prev, curr) => Math.max(prev, curr), 0)
  const max_speed = Math.max(max_speed_rec, max_speed_trans)
  for (let i = 1; i < NETWORK_SPEED_STEPS.length; i++) {
    if(max_speed < NETWORK_SPEED_STEPS[i] && max_speed > NETWORK_SPEED_STEPS[i-1]){
      maxValue = NETWORK_SPEED_STEPS[i]
      maxLabel = NETWORK_SPEED_LABELS[i]
      index = i
    }
  }
  /*if(maxValue > max_speed/2 && index < steps.length - 1) {
    maxValue = steps[index+1]
    maxLabel = stepsLabels[index+1]
  }*/
  return {
    maxValue,
    maxLabel
  }
}