// ldaps test (example, update paths)
var express = require('express'),
    ntlm = require('express-ntlm'),
    fs = require('fs');

var app = express();

// const cert = fs.readFileSync('/opt/test/Certificate/ca.ldap.pem');

app.use(ntlm({ /* ... */ }));

app.listen(8810);
