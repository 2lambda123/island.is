const { withNxMetro } = require('@nrwl/react-native');
const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();
  const { projectRoot, ...cfg } = withNxMetro(
    {
      transformer: {
        // babelTransformerPath: null,
        getTransformOptions: async () => ({
          transform: {
            experimentalImportSupport: false,
            inlineRequires: false,
          },
        }),
      },
    },
    {
      debug: false,
    },
  );
  cfg.projectRoot = projectRoot;
  cfg.watchFolders = [projectRoot];

  return cfg;
})();
