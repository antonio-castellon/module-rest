//
// test module
//

const SERVER = require('./config.server.js');
const AUTH = require('./config.auth.js');
const API = require('./api.js');

const rest = require('./rest.js')(SERVER, AUTH, API);
rest.run(() => { console.log(' ... call back function , server is running ')});
