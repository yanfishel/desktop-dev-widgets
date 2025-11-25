import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';
import path from "node:path";

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    alias: {
      "@assets*": path.resolve(__dirname, 'src/assets/*'),
      "@config*": path.resolve(__dirname, 'src/config/*'),
      "@constants*": path.resolve(__dirname, 'src/constants/*'),
      "@controllers*": path.resolve(__dirname, 'src/controllers/*'),
      "@types*": path.resolve(__dirname, 'src/types/*'),
      "@utils*": path.resolve(__dirname, 'src/utils/*'),
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
};
