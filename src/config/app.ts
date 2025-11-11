import {app} from "electron";
import * as path from "node:path";
import { homedir } from "os";

export const config = {
  applicationName: 'Dev Widgets',

  sourceSettingsPath: path.join(app.getAppPath(), 'public', 'default-settings.json'),
  appSettingsDir: path.join(app.getPath('documents'), 'dev-components'),
  appSettingsPath: path.join( app.getPath('documents'), 'dev-components', 'app-settings.json'),

  iconPath: path.join(app.getAppPath(), 'public', 'assets', 'electron.png'),
  homePath: path.join(homedir())
}
