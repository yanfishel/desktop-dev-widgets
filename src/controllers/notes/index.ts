import {NOTES_PLACEHOLDER} from "../../constans";
import Toast from "../../shared/toast";
import { getWidgetsSettings, getStorageItem, setStorageItem } from "../../utils";
import { notesWidgetHtml } from "./html";

import "./style.css"


class NotesController {
  static instance: NotesController | null = null

  #widgetsSettings:IWidgetsSettings
  #toast: Toast
  #input: HTMLTextAreaElement
  #view: HTMLElement
  #buttonCopy: HTMLElement
  #buttonClear: HTMLElement

  constructor() {
    const settings = getWidgetsSettings()
    this.#widgetsSettings = settings
  }


  static getInstance() {
    if (!NotesController.instance) {
      NotesController.instance = new NotesController()
    }

    return NotesController.instance
  }

  build(container: HTMLElement) {
    const elem = document.createElement('div')
    elem.id = 'notes-widget'
    elem.innerHTML = notesWidgetHtml

    this.#input = elem.querySelector('textarea')
    this.#view = elem.querySelector('.notes-view')
    this.#buttonCopy = elem.querySelector('.copy-button')
    this.#buttonClear = elem.querySelector('.clear-button')

    const notes = getStorageItem('dev-widgets-notes')
    this.updateNotes(notes !== null ? notes : NOTES_PLACEHOLDER)

    this.#toast = new Toast(elem)

    this.listeners()

    container.appendChild(elem)
  }
  
  listeners() {
    this.#input.addEventListener('change', (e:any)=> {
      this.updateNotes(e.target.value)
    })
    this.#input.addEventListener('focus', (e:any)=> {
      this.switchVisibility(true)
    })
    this.#input.addEventListener('blur', (e:any)=> {
      this.switchVisibility(false)
    })
    this.#view.addEventListener('click', (e:any)=> {
      this.#input.focus()
    })

    this.#buttonClear.addEventListener('click', (e:any)=> {
      e.preventDefault()
      this.clearNotes()
    })
    this.#buttonCopy.addEventListener('click', (e:any)=> {
      e.preventDefault()
      this.copyNotesToClipboard()
    })
  }

  switchVisibility(edit = false){
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.#input.style.opacity = edit ? 1 : 0
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.#view.style.opacity = edit ? 0 : 1
  }
  
  updateNotes(notes:string){
    if(notes === '') {
      this.#view.innerHTML = ''
      setStorageItem('dev-widgets-notes', '')
      return
    }
    const filteredValue = notes.split('\n').filter(note=>note!=='')
    const list = document.createElement('ul')
    filteredValue.forEach(note=>{
      const item = document.createElement('li')
      item.textContent = note
      list.appendChild(item)
    })
    this.#view.innerHTML = ''
    this.#view.appendChild(list)
    const stringValue = filteredValue.join('\n')
    this.#input.value = stringValue
    setStorageItem('dev-widgets-notes', stringValue)
  }

  async copyNotesToClipboard() {
    if(!this.#input.value) return
    try {
      await navigator.clipboard.writeText(this.#input.value);
      this.#toast.success('Copied to clipboard!')
    } catch (err) {
      this.#toast.error('Failed to copy!')
      console.error('Failed to copy: ', err);
    }
  }

  clearNotes() {
    this.updateNotes('')
  }

}

export type { NotesController }
const notesController = NotesController.getInstance()
export default notesController