const FileManagerPlugin = require('filemanager-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const {
  addWebpackPlugin,
  override,
  disableChunk,
  adjustStyleLoaders,
} = require('customize-cra');
const packageJson = require('./package.json');

module.exports = {
  webpack: override(
    (config) => {
      config.output.filename = 'js/bundle.js';
      config.optimization.minimize = false;
      config.ignoreWarnings = [/Failed to parse source map/];
      return config;
    },
    adjustStyleLoaders(({ use }) => {
      const styleLoader = use[0].loader.replace(
        'mini-css-extract-plugin/dist/loader.js',
        'style-loader',
      );
      use[0] = styleLoader;
    }),
    disableChunk(),
    addWebpackPlugin(
      new FileManagerPlugin({
        events: {
          onEnd: {
            archive: [
              {
                source: './build',
                destination: './build/extension.zip',
              },
            ],
          },
        },
      }),
    ),
    addWebpackPlugin(
      new WebpackManifestPlugin({
        generate(_, files) {
          return {
            manifest_version: 3,
            name: 'Brokalys: ss.lv historical prices',
            description: packageJson.description,
            homepage_url: 'https://brokalys.com',
            version: packageJson.version,
            icons: {
              512: 'favicon.png',
            },
            action: {
              default_icon: 'favicon.png',
            },
            content_scripts: [
              {
                matches: [
                  'https://www.ss.lv/msg/*/real-estate/*',
                  'https://www.ss.com/msg/*/real-estate/*',
                ],
                js: files
                  .filter(({ isInitial }) => isInitial)
                  .map(({ path }) => path),
                run_at: 'document_idle',
              },
            ],
            author: packageJson.author,
          };
        },
      }),
    ),
  ),
};
