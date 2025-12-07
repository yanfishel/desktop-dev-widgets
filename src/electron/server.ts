import http from "node:http";
import { Server } from "node:net";

class ServerController {
  static instance:ServerController

  #PORT = 8000
  #server:Server = null

  static getInstance() {
    if(!ServerController.instance) {
      ServerController.instance = new ServerController()
    }
    return ServerController.instance
  }


  public startServer() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.#server = http.createServer((req:any, res:any) => {
      console.log(`Server received request for: ${req.url}`);



      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end(`Hello from the Electron server on port ${this.#PORT}!\n`);

      // Example of sending a message back to the renderer process via IPC
      //browserWindow.webContents.send('server-message', `Request processed for URL: ${req.url}`);
    });

    this.#server.listen(this.#PORT, 'localhost', () => {
      console.log(`HTTP server listening on http://localhost:${this.#PORT}`);
      // You can also send this information to the renderer process
      //browserWindow.webContents.send('server-started', `Server is running on port ${PORT}`);
    });

    // Handle server errors (e.g., port already in use)
    this.#server.on('error', (e:any) => {
      console.error(`Server error: ${e.message}`);
      if (e.code === 'EADDRINUSE') {
        console.error(`Port ${this.#PORT} is already in use. Try a different port.`);
      }
      this.stopServer()
    });
  }

  public stopServer() {
    this.#server.close()
    this.#server = null
  }

}

const serverController = ServerController.getInstance()
export default serverController