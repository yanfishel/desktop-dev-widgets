import { format } from "date-fns";
import { TZDate } from "@date-fns/tz";

import Toast from "../../../shared/toast";
import {DATE_FORMAT_STANDARTS} from "../../../constans";
import {dateTimeTabHtml } from "./html";
import './style.css'


type TInputField = {
  name: string,
  elem: HTMLInputElement
}

class DateTimeTabController {
  static instance: DateTimeTabController | null = null

  #toast: Toast
  #started = false

  #elem: HTMLElement
  #currentSeconds:HTMLInputElement
  #currentMilliseconds:HTMLInputElement
  #milliseconds:HTMLInputElement
  #seconds:HTMLInputElement
  #timeZone:HTMLInputElement
  #year:HTMLInputElement
  #month:HTMLInputElement
  #day:HTMLInputElement
  #hour:HTMLInputElement
  #minute:HTMLInputElement
  #second:HTMLInputElement
  #helpText:HTMLElement
  #standartFormat:HTMLInputElement
  #addOffset:HTMLInputElement
  #addTimeZone:HTMLInputElement
  #dateString:HTMLInputElement
  #currentTimeZone:string = Intl.DateTimeFormat().resolvedOptions().timeZone
  #dateInputs:TInputField[]

  static getInstance() {
    if (!DateTimeTabController.instance) {
      DateTimeTabController.instance = new DateTimeTabController()
    }
    return DateTimeTabController.instance
  }

  public build(container: HTMLElement){
    const elem = document.createElement('section')
    elem.innerHTML = dateTimeTabHtml

    this.#currentSeconds = elem.querySelector('input[name="current-seconds"]')
    this.#currentMilliseconds = elem.querySelector('input[name="current-milliseconds"]')
    this.#milliseconds = elem.querySelector('input[name="milliseconds"]')
    this.#seconds = elem.querySelector('input[name="seconds"]')
    this.#timeZone = elem.querySelector('select[name="time-zone"]')
    this.#year = elem.querySelector('input[name="year"]')
    this.#month = elem.querySelector('input[name="month"]')
    this.#day = elem.querySelector('input[name="day"]')
    this.#hour = elem.querySelector('input[name="hour"]')
    this.#minute = elem.querySelector('input[name="minute"]')
    this.#second = elem.querySelector('input[name="second"]')
    this.#helpText = elem.querySelector('.help-text')
    this.#dateString = elem.querySelector('input[name="date-time-string"]')

    this.#addOffset = elem.querySelector('input[name="add-offset"]')
    this.#addOffset.addEventListener('change', ()=> this.updateResult())
    this.#addTimeZone = elem.querySelector('input[name="add-time-zone"]')
    this.#addTimeZone.addEventListener('change', ()=> this.updateResult())

    this.#dateInputs = [
      {name: 'milliseconds', elem: this.#milliseconds},
      {name: 'seconds', elem: this.#seconds},
      {name: 'year', elem: this.#year},
      {name: 'month', elem: this.#month},
      {name: 'day', elem: this.#day},
      {name: 'hour', elem: this.#hour},
      {name: 'minute', elem: this.#minute},
      {name: 'second', elem: this.#second}
    ]

    const setNowButton = elem.querySelector('button')
    setNowButton.addEventListener('click', ()=>this.setNow())

    const copyButtons = elem.querySelectorAll('.copy-button')
    copyButtons.forEach(button => button.addEventListener('click', (e)=>this.copyToClipboard(e)))

    this.#standartFormat = elem.querySelector('select[name="standart-formats"]')
    this.#standartFormat.addEventListener('change', ()=> this.updateResult())

    this.#timeZone.innerHTML =  (Intl as any).supportedValuesOf('timeZone').map((zone:string) => `<option value="${zone}">${zone}</option>`).join('')
    this.#timeZone.value = this.#currentTimeZone
    this.#timeZone.addEventListener('change', ()=> {
      const currentDate = new Date(+this.#milliseconds.value)
      this.fillDate(currentDate)
    })

    this.#dateInputs.forEach(input => {
      input.elem.addEventListener('keyup', (e: any) => {
        const valid = this.validField(e)
        if(!valid) return
        if(input.name === 'milliseconds' || input.name === 'seconds') {
          this.setTime(input.name === 'seconds')
        } else {
          this.setDateTime()
        }
      })
    })

    this.#toast = new Toast(elem.querySelector('.date-time-container'))

    this.start()

    this.setNow()

    this.#elem = elem
    container.appendChild(elem)

  }

  private start(){
    this.#started = true
    this.update()
  }

  private stop() {
    this.#started = false
  }

  public toggleActive(active = false) {
    if(active) this.start()
    else this.stop()
  }

  private update() {
    const now = new Date()
    this.#currentSeconds.value = Math.floor(now.getTime() / 1000).toString()
    this.#currentMilliseconds.value = now.getTime().toString()
    if(this.#started) {
      setTimeout(()=>this.update(), 1000 - (now.getMilliseconds() % 1000))
    }
  }

  private setNow() {
    const date = new Date()
    this.#milliseconds.value = date.getTime().toString()
    this.#seconds.value = Math.floor(date.getTime() / 1000).toString()

    this.fillDate(date)
  }

  private setTime(isSeconds = false){
    let timestamp = +this.#milliseconds.value
    if(isSeconds) {
      timestamp = +this.#seconds.value * 1000
      this.#milliseconds.value = timestamp.toString()
    } else {
      this.#seconds.value = Math.floor(timestamp / 1000).toString()
    }
    this.fillDate(new Date(timestamp))
  }

  private setDateTime() {
    const invalid = this.#dateInputs
        .filter(inp => inp.name !== 'seconds' && inp.name !== 'milliseconds')
        .some(input => input.elem.value.trim() === '' || !this.validField({target: input.elem}))
    if(invalid) return

    const fnDate = this.getDate()
    const timestamp = fnDate.getTime()
    this.#seconds.value = Math.floor(timestamp / 1000).toString()
    this.#milliseconds.value = timestamp.toString()

    this.updateResult()
  }

  private getDate(){
    const year = this.#year.value
    const month = this.#month.value
    const day = this.#day.value
    const hour = this.#hour.value
    const minute = this.#minute.value
    const second = this.#second.value

    return new Date(+year, +month-1, +day, +hour, +minute, +second)
  }

  private fillDate(date:Date) {
    const tzDate = new TZDate(date, this.#timeZone.value)

    this.#year.value = tzDate.getFullYear().toString()
    this.#month.value = (tzDate.getMonth() + 1).toString()
    this.#day.value = tzDate.getDate().toString()
    this.#hour.value = tzDate.getHours().toString()
    this.#minute.value = tzDate.getMinutes().toString()
    this.#second.value = tzDate.getSeconds().toString()

    this.updateResult()
  }

  private updateResult(){
    const date = new Date(+this.#milliseconds.value)

    this.#helpText.textContent = `${format(date, 'eeee')}, ${format(date, 'Do')} day, ${format(date, 'wo')} week, ${format(date, 'qqqq')}`

    const standart = DATE_FORMAT_STANDARTS.find(format => format.name === this.#standartFormat.value)
    this.#addOffset.disabled = standart?.name === 'ISO-8601-date-time-UTC'
    this.#addTimeZone.disabled = standart?.name === 'ISO-8601-date-time-UTC'
    let formattedString = ''
    if(standart?.name === 'ISO-8601-date-time-UTC'){
      const y = date.getUTCFullYear()
      const m = (date.getUTCMonth()+1).toString().padStart(2, '0')
      const d = date.getUTCDate().toString().padStart(2, '0')
      const H = date.getUTCHours().toString().padStart(2, '0')
      const M = date.getUTCMinutes().toString().padStart(2, '0')
      const s = date.getUTCSeconds().toString().padStart(2, '0')
      const ms = date.getUTCMilliseconds().toString().padStart(3, '0')
      formattedString = `${y}-${m}-${d}T${H}:${M}:${s}.${ms}Z`;
    } else {
      const template = `${standart?.format ?? DATE_FORMAT_STANDARTS[0].format}${this.#addOffset.checked ? 'xxx' : ''}`
      const timezone = `${this.#addTimeZone.checked ? `[${this.#timeZone.value ?? Intl.DateTimeFormat().resolvedOptions().timeZone}]` : ''}`
      formattedString = format(date, template) + timezone
    }
    this.#dateString.value = formattedString
  }

  private validField(event:any){
    this.#elem.querySelectorAll('input[class="has-error"]').forEach(input => input.classList.remove('has-error'))
    const name = event.target.name;
    const parsedValue = parseInt(event.target.value)
    let isValid = !isNaN(parsedValue)
    switch (name) {
      case 'year': isValid = parsedValue >= 1970 && parsedValue <= 9999; break;
      case 'month': isValid = parsedValue >= 1 && parsedValue <= 12; break;
      case 'day': isValid = parsedValue >= 1 && parsedValue <= 31; break;
      case 'hour': isValid = parsedValue >= 0 && parsedValue <= 23; break;
      case 'minute': isValid = parsedValue >= 0 && parsedValue <= 59; break;
      case 'second': isValid = parsedValue >= 0 && parsedValue <= 59; break;
      default: break;
    }
    if(!isValid) {
      event.target.classList.add('has-error')
      return false
    }
    return true
  }

  private async copyToClipboard(e:any) {
    const fieldName = e.target.dataset.copy || e.target.closest('.copy-button')?.dataset.copy
    if(!fieldName) return
    let value = ''
    switch (fieldName) {
      case 'date-time-string': value = this.#dateString.value; break;
      case 'current-seconds': value = this.#currentSeconds.value; break;
      case 'current-milliseconds': value = this.#currentMilliseconds.value; break;
    }
    if(!value) return
    try {
      await navigator.clipboard.writeText(value);
      this.#toast.success({message: 'Copied!'})
    } catch (err) {
      this.#toast.error({message: 'Failed to copy!'})
      console.error('Failed to copy: ', err);
    }
  }

}

export type { DateTimeTabController }
const dateTimeTabController = DateTimeTabController.getInstance()
export default dateTimeTabController