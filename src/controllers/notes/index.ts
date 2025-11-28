import { STORAGE_KEYS } from "../../constants";
import Toast from "../../controllers/toast";
import {getStorageItem, setStorageItem, getWidgetsSettings, setWidgetsWidgetSetting} from "../../utils";
import {notesWidgetHtml, settingsMenuNotesHtml} from "./html";

import "./style.css"


class NotesController {
  static instance: NotesController | null = null

  placeholder = 'TYPE YOUR NOTES HERE'

  #id: string
  #toast: Toast
  #input: HTMLTextAreaElement
  #view: HTMLElement
  #buttonCopy: HTMLElement
  #buttonClear: HTMLElement


  static getInstance() {
    if (!NotesController.instance) {
      NotesController.instance = new NotesController()
    }

    return NotesController.instance
  }

  public build(container: HTMLElement) {
    const settings = getWidgetsSettings()
    this.#id = settings.widgets.notes.id
    const elem = document.createElement('div')
    elem.id = this.#id
    elem.innerHTML = notesWidgetHtml
    elem.style.order = settings.widgets.notes.order+''
    elem.style.display = settings.widgets.notes.active ? 'block' : 'none'

    this.#input = elem.querySelector('textarea')
    this.#view = elem.querySelector('.notes-view')
    this.#buttonCopy = elem.querySelector('.copy-button')
    this.#buttonClear = elem.querySelector('.clear-button')

    const notes = getStorageItem(STORAGE_KEYS.WIDGET_NOTES_NOTES)
    this.updateNotes(notes !== null ? notes : this.placeholder)

    this.#toast = new Toast(elem)

    this.listeners()

    container.appendChild(elem)
  }

  public settingsMenuElement() {
    const settings = getWidgetsSettings()

    const element = document.createElement('div')
    element.classList.add('settings-menu-item')
    element.innerHTML = settingsMenuNotesHtml
    const checkbox:HTMLInputElement = element.querySelector('input[name="notes-active"]')
    checkbox.checked = settings.widgets.notes.active

    checkbox.addEventListener('change', (e:any)=> {
      document.getElementById(settings.widgets.notes.id).style.display = e.target.checked ? 'block' : 'none'
      setWidgetsWidgetSetting('notes', {...settings.widgets.notes, active: e.target.checked })
    })
    return element
  }
  
  private listeners() {
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

  private switchVisibility(edit = false){
    this.#input.style.opacity = edit ? '1' : '0'
    this.#view.style.opacity = edit ? '0' : '1'
  }
  
  private updateNotes(notes:string){
    if(notes === '') {
      this.#view.innerHTML = ''
      setStorageItem(STORAGE_KEYS.WIDGET_NOTES_NOTES, '')
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
    setStorageItem(STORAGE_KEYS.WIDGET_NOTES_NOTES, stringValue)
  }

  private async copyNotesToClipboard() {
    if(!this.#input.value) return
    try {
      await navigator.clipboard.writeText(this.#input.value);
      this.#toast.success({message:'Copied!'})
    } catch (err) {
      this.#toast.error({message:'Failed to copy!'})
      console.error('Failed to copy: ', err);
    }
  }

  private clearNotes() {
    this.updateNotes('')
  }

}

export type { NotesController }
const notesController = NotesController.getInstance()
export default notesController