# REST
Module to encapsulate the common configuration of a base WS based in REST (HTTPS) 

---

Example Code to use this module:

    const rest = require('./rest.js')({SERVER: './config.server.js', AUTH: './config.auth.js'});
    rest.run(); 


Configuration Files required:

#### - config.server.js

    module.exports = {
        CERTIFICATION_PATH : '/opt/<project>/Certificate'
        ,PORT : 7000
        ,WHITELIST : './whitelist'
        ,API : './api.js'
    }

#### - config.auth.js

    module.exports = {
        url: 'ldap://<address>:389'
        ,baseDN: 'DC=<>,DC=<>>'
        ,username: '<username>'
        ,password: '<password>'
    
        ,hostNames: {
            'DEV' : '<dev-server.ip.dns.name>'
            ,'QA' : '<QA-server.ip.dns.name>'
            ,'PROD' : '<production-server.ip.dns.name>'
        }
        ,passToken: '<token-used>'          /* JWT token */
        ,EXPIRES: 86400                     /* expires in 24 hours */
    
        , AUTH_TYPE : 'NTLM'  /* NTLM, JWT or NONE */
    
        ,MOCKUP_USERS : ['acastellon']
        ,MOCKUP_ROLES : ['User','Admin']
        ,ROLES : {                          /* LDAP Roles to match */
            'User': '<LDAP> USER '          
            , 'Admin': '<LDAP> ADMINISTRATOR '
            , 'Viewer': '<LDAP> VIEWER '
        }
    }
---

Security files required:

##### - privateKey.pem
##### - publicCert.pem
##### - passphrase


Other files required:

##### - whitelist : used by CORS
##### - build.txt : if you want to trace the build version of your app
