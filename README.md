# REST
Module to encapsulate the common configuration of a base WS based in REST (HTTPS) 

---

Example Code to use this module:

    const SERVER = require('./config.server.js');
    const AUTH = require('./config.auth.js');
    const API = require('./api.js');
    
    const rest = require('@acastellon/rest')(SERVER, AUTH, API);
    rest.run(); 
    
you can pass a function to be executed after the initialization of the server

    rest.run(callback())
    
    rest.run(() => { .. })


Example of configuration files required:

#### - config.server.js

    module.exports = {
        /* where are stored the certificate files */
        CERTIFICATION_PATH : '/opt/<project>/Certificate'
        
        /* listener port */ 
        ,PORT : 7000
        
        /* file used by CORS to allows requst to the server */
        ,WHITELIST : './whitelist'
   
        /* location of the static files if is needed */
        ,STATIC_PATH : '/html'         //null = no static files where associated
    }

#### - config.auth.js

    module.exports = {
        url: 'ldap://<address>:389'
        ,DOMAIN: '<domain>'
        ,baseDN: 'DC=<>,DC=<>>'
        ,username: '<username>'
        ,password: '<password>'
    
        ,hostNames: {
            'DEV' : '<dev-server.ip.dns.name>'
            ,'QA' : '<QA-server.ip.dns.name>'
            ,'PROD' : '<production-server.ip.dns.name>'
        }
        ,passToken: '<passphrase-optional>'  /* if doesn't exists the module generates ones automatically */
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
    
    
##### - api.js
 
    - See the api.template.js as a reference to implement the logic.


    
---

Security files required:

##### - privateKey.pem
##### - publicCert.pem
##### - passphrase


Other files required:

##### - whitelist : used by CORS

