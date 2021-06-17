module.exports = {
  css: {
    extract: false,
  },

  pages: {
    popup: {
      template: 'public/browser-extension.html',
      entry: './src/popup/main.js',
      title: 'Popup',
    },
  },

  // https://github.com/adambullmer/vue-cli-plugin-browser-extension#plugin-options
  pluginOptions: {
    browserExtension: {
      components: {
        background: true,
        contentScripts: true,
        popup: true,
      },

      componentOptions: {
        background: {
          entry: 'src/background.js',
        },

        contentScripts: {
          entries: {
            content: ['src/content-scripts/main.js'],
          },
        },
      },

      // https://vue-web-extension.netlify.app/development/Vue-Devtools.html#configuring-your-extension
      manifestTransformer: (manifest) => {
        if (process.env.NODE_ENV === 'development') {
          manifest.content_security_policy = manifest.content_security_policy.replace(
            'script-src',
            'script-src http://localhost:8098'
          )
        }

        return manifest
      },
    },
  },
}
