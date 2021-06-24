//
// test module
//

const SERVER = require('/opt/test/config.server.js');
const AUTH = require('/opt/test/config.auth.js');
const API = require('./api.template.js');

const rest = require('./rest.js')(SERVER, AUTH, API);
rest.run(() => { console.log(' ... call back function , server is running ')});
