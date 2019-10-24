//
// test module
//

const rest = require('./rest.js')({SERVER: './config.server.js', AUTH: './config.auth.js'});
rest.run();
