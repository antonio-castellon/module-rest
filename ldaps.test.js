var express = require('express'),
    ntlm = require('express-ntlm'),
    fs = require('fs');

var app = express();

const cert = fs.readFileSync('/opt/test/Certificate/ca.ldap.pem');
//console.log(String.fromCharCode.apply(null, new Uint16Array(cert)));
//console.log(process.env.NODE_EXTRA_CA_CERTS);


app.use(ntlm({
    debug: function() {
        var args = Array.prototype.slice.apply(arguments);
        console.log.apply(null, args);
    },
    internalservererror: function(request, response, next) {
        // console.log(request)
       // console.log(response);
        console.log(request.ntlm.UserName);
        response.sendStatus(500);
    },
    forbidden: function(request, response, next) {
        // console.log(request)
        // console.log(request.headers.authorization);

        // var decoded = request.headers.authorization.split(" ")[1]
        // console.log(new Buffer(decoded, 'base64').toString('utf-8'));

        const user = request.ntlm.UserName;
        console.log(user);

        const setup = require('../module-ldap/config.ldap.js');
        const ldap = require('../module-ldap/ldap.js')(setup);

        ldap.getRoles(user).then(function(value) { console.log(value); });
        ldap.getIMDL(user).then(function(value) { console.log(value[0]); });
        ldap.getEmail(user).then(function(value) { console.log('@email : ' + value); });

        response.sendStatus(200);
    },
    domain: 'PMI',
    domaincontroller: 'ldaps://ldap.app.pmi',
    tlsOptions: {
        //trusted certificate authorities (can be extracted from the server with openssh)
        ca:  '/opt/test/Certificate/ca.ldap.pem',
        //tells the tls module not to check the server's certificate (do not use in production)
        rejectUnauthorized: false,
    }
}));

//app.use(ntlm());

//same as above
app.all('*', function(request, response) {
    response.end(JSON.stringify(request.ntlm)); // {"DomainName":"MYDOMAIN","UserName":"MYUSER","Workstation":"MYWORKSTATION"}
});

app.listen(8810);

// openssl s_client -showcerts -servername ldap.app.pmi -connect ldap.app.pmi:636 </dev/null
