import type { Configuration } from 'webpack';
import * as path from "node:path";

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main.ts',
  // Put your normal webpack config below here
  module: {
    rules,
  },
  plugins,
  resolve: {
    alias: {
      "@electron*": path.resolve(__dirname, 'src/electron/*'),
      "@ipc*": path.resolve(__dirname, 'src/ipc/*'),
      "@constants*": path.resolve(__dirname, 'src/constants/*'),
      "@config*": path.resolve(__dirname, 'src/config/*'),
      "@types*": path.resolve(__dirname, 'src/types/*')
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
};
