import {app} from "electron";
import * as path from "node:path";
import { homedir } from "os";

export const config = {
  applicationName: 'Desktop D Widgets',

  appSettingsDir: path.join(app.getPath('documents'), 'dev-components'),
  appSettingsPath: path.join( app.getPath('documents'), 'dev-components', 'app-settings.json'),

  iconPath: path.join(app.getAppPath(), 'public', 'images', 'icon.png'),
  homePath: path.join(homedir())
}
