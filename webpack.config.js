const path = require('path');

module.exports = {
  entry: './fb_login.html',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
};
