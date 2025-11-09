/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';

console.log(
  '👋 This message is being logged by "renderer.js", included via webpack',
);


document.addEventListener('DOMContentLoaded', () => {
  updateTime() // Call the updateTime function when the DOM content is loaded
})

function updateTime() {
  const now = new Date() // Create a new Date object to get the current date and time
  let hour: string | number = now.getHours() // Get the current hour
  let minute: string | number = now.getMinutes() // Get the current minute
  let second: string | number = now.getSeconds() // Get the current second

  const dateElement = document.getElementById('date') // Get the element with the id "date"
  dateElement.textContent = now.toDateString() // Set the text content of the date element to the current date

  hour = hour < 10 ? '0' + hour : hour // Add leading zero if hour is less than 10
  minute = minute < 10 ? '0' + minute : minute // Add leading zero if minute is less than 10
  second = second < 10 ? '0' + second : second // Add leading zero if second is less than 10

  const timeHTML = hour + ':' + minute + ':' + second // Create a string with the formatted time
  document.getElementById('clock').textContent = timeHTML // Set the text content of the clock element to the formatted time
}

setInterval(updateTime, 1000) // Call the updateTime function every second to update the clock
