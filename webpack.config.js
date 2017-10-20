var webConfig = {
  entry: './src/protocol-execution-ui.js',
  output: {
    filename: 'protocol-execution-ui.js',
    // use library + libraryTarget to expose module globally
    library: 'ProtocolExecutionUI',
    libraryTarget: 'var'
  }
};

module.exports = webConfig;
