import http from "node:http";
import { Server } from "node:net";

import {DEFAULT_HOST, DEFAULT_PORT, SERVER_RESPONSE} from "../constants";
import {IpcChannels} from "../ipc/channels";
import winController from "./windows";



type TContract = Record<string, string>

type TResponseBody = {
  contract: TContract
  repeat: number
}

type TResponseEndpoint = {
  path: string,
  body: TResponseBody
}

type TServerParams = {
  PORT:number
  endpoints: TResponseEndpoint[]
}


class ServerController {
  static instance:ServerController

  #PORT = DEFAULT_PORT
  #HOST = DEFAULT_HOST
  #server:Server = null

  static getInstance() {
    if(!ServerController.instance) {
      ServerController.instance = new ServerController()
    }
    return ServerController.instance
  }


  public startServer() {
    if(this.#server) {
      this.stopServer()
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.#server = http.createServer((req:any, res:any) => {
      console.log(`Server received request for: ${req.url}`);

      if (req.method !== 'GET') {
        res.writeHead(405, { 'Allow': 'GET' });
        return res.end(JSON.stringify({ error: 'Method not allowed' }));
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end(`Hello from the Electron server on port ${this.#PORT}!\n`);

      // Example of sending a message back to the renderer process via IPC
      //browserWindow.webContents.send('server-message', `Request processed for URL: ${req.url}`);
    });

    this.#server.listen(this.#PORT, this.#HOST, () => {
      console.log(`HTTP server listening on http://localhost:${this.#PORT}`);
      this.responseToMain(SERVER_RESPONSE.SERVER_STARTED)
    });

    // Handle server errors (e.g., port already in use)
    this.#server.on('error', (e:any) => this.onServerError(e));
  }

  public testServer(port:number){
    if(this.#server) {
      this.stopServer()
    }
    this.#PORT = port
    this.#server = http.createServer()
      .listen(this.#PORT, this.#HOST, ()=> {
        console.log(`HTTP server listening on http://localhost:${this.#PORT}`);
        this.responseToMain( SERVER_RESPONSE.SERVER_TESTED )
        this.stopServer(true)
      })
      .on('error', (e:any) => this.onServerError(e));
  }

  public stopServer(silent = false) {
    if(!this.#server) return
    this.#server.close()
    this.#server = null
    if(!silent){
      this.responseToMain( SERVER_RESPONSE.SERVER_STOPPED )
    }
  }

  private onServerError(e:any) {
    let errorMessage = e.message
    console.error(`Server error: ${errorMessage}`);
    if (e.code === 'EADDRINUSE') {
      console.error(`Port ${this.#PORT} is already in use. Try a different port.`);
      errorMessage = `Port ${this.#PORT} is already in use. Try a different port.`
    }
    this.responseToMain(errorMessage, true)
    this.stopServer(true)
  }

  private responseToMain(message:string, error = false){
    const value = JSON.stringify({ message, "port":this.#PORT })
    winController.sendToMain( error ? IpcChannels.MOCK_SERVER_ERROR : IpcChannels.MOCK_SERVER_RESPONSE, value)
  }

}

const serverController = ServerController.getInstance()
export default serverController