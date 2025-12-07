import {app} from "electron";
import * as path from "node:path";
import { homedir } from "os";

export const config = {
  applicationName: app.name || app.getName() || 'Desktop Widgets',

  appSettingsDir: path.join( app.getPath('documents'), 'desktop-widgets'),
  appSettingsPath: path.join( app.getPath('documents'), 'desktop-widgets', 'app-settings.json'),

  iconPath: path.join(app.getAppPath(), 'public', 'images', 'icon-256.png'),
  homePath: path.join(homedir())
}