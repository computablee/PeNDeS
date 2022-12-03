// DO NOT EDIT THIS FILE
// This file is automatically generated from the webgme-setup-tool.
'use strict';


var config = require('webgme/config/config.default'),
    validateConfig = require('webgme/config/validator');

// The paths can be loaded from the webgme-setup.json



config.visualization.panelPaths.push(__dirname + '/../node_modules/webgme-icore/src/visualizers/panels');




// Visualizer descriptors
config.visualization.visualizerDescriptors.push(__dirname + '/../src/visualizers/Visualizers.json');
// Add requirejs paths
config.requirejsPaths = {
  'ICore': 'panels/ICore/ICorePanel',
  'panels': './src/visualizers/panels',
  'widgets': './src/visualizers/widgets',
  'panels/ICore': './node_modules/webgme-icore/src/visualizers/panels/ICore',
  'widgets/ICore': './node_modules/webgme-icore/src/visualizers/widgets/ICore',
  'webgme-icore': './node_modules/webgme-icore/src/common',
  'wdestup': './src/common'
};


config.mongo.uri = 'mongodb://127.0.0.1:27017/wdestup';
validateConfig(config);
module.exports = config;
