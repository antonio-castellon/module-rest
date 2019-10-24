//
// test module
//

const rest = require('./')({SERVER: './config.server.js', AUTH: './config.auth.js'});
rest.run();