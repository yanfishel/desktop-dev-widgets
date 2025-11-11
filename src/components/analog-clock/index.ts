
class AnalogClock {

  #hourhand: HTMLElement
  #minutehand: HTMLElement
  #secondhand: HTMLElement
  #date: HTMLElement

  build(container: HTMLElement ) {
    const html = `
          <div class="hour12"></div>
          <div class="hour1"></div>
          <div class="hour2"></div>
          <div class="hour3"></div>
          <div class="hour4"></div>
          <div class="hour5"></div>
          <div class="logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path fill="currentColor" d="M15.95 12.3L11.7 8.05q-.15-.15-.212-.325t-.063-.375t.063-.375t.212-.325l4.25-4.25q.15-.15.325-.212t.375-.063t.375.063t.325.212l4.25 4.25q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.25 4.25q-.15.15-.325.213t-.375.062t-.375-.062t-.325-.213M3 10V4q0-.425.288-.712T4 3h6q.425 0 .713.288T11 4v6q0 .425-.288.713T10 11H4q-.425 0-.712-.288T3 10m10 10v-6q0-.425.288-.712T14 13h6q.425 0 .713.288T21 14v6q0 .425-.288.713T20 21h-6q-.425 0-.712-.288T13 20M3 20v-6q0-.425.288-.712T4 13h6q.425 0 .713.288T11 14v6q0 .425-.288.713T10 21H4q-.425 0-.712-.288T3 20" />
            </svg>
          </div>
          <div class="date"></div>
          <div class="hourhand"></div>
          <div class="minutehand"></div>
          <div class="secondhand"></div>
          <div class="nail"></div>`

    const elem = document.createElement('div')
    elem.id = 'analog-clock'
    elem.innerHTML = html
    container.appendChild(elem)

    this.#hourhand = elem.querySelector('.hourhand')
    this.#minutehand = elem.querySelector('.minutehand')
    this.#secondhand = elem.querySelector('.secondhand')
    this.#date = elem.querySelector('.date')

    this.update()
  }

  update() {
    const now = new Date() // Create a new Date object to get the current date and time
    const hour = now.getHours() // Get the current hour
    const minute = now.getMinutes() // Get the current minute
    const second = now.getSeconds() // Get the current second

    this.#hourhand.style.transform = `rotate(${(hour * 30) + (minute / 2) - 90}deg)`
    this.#minutehand.style.transform = `rotate(${(minute * 6) + (second / 10) - 90}deg)`
    this.#secondhand.style.transform = `rotate(${second * 6 - 90}deg)`

    this.#date.innerHTML = '<span>'+new Intl.DateTimeFormat('en-US', { weekday:'long' }).format(now) + '</span>' + new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short' }).format(now)

    setTimeout(this.update.bind(this), 1000)
  }

}


export default new AnalogClock()