module.exports = {
    url: 'ldaps://<address>:636'
    ,baseDN: 'DC=<>,DC=<>>'
    ,username: '<username>'
    ,password: '<password>'
    ,tlsOptions: {
        'rejectUnauthorized': false
    }
    ,hostNames: {
        'DEV' : '<dev-server.ip.dns.name>'
        ,'QA' : '<QA-server.ip.dns.name>'
        ,'PROD' : '<production-server.ip.dns.name>'
    }

    ,passToken: '<token-used>'
    ,EXPIRES: 86400                     /* expires in 24 hours */

    , AUTH_TYPE : 'NTLM'  /* NTLM, JWT or NONE */

    ,MOCKUP_USERS : ['acastellon']
    ,MOCKUP_ROLES : ['User','Admin']
    ,ROLES : {
        'User': '<LDAP> USER '
        , 'Admin': '<LDAP> ADMINISTRATOR '
        , 'Viewer': '<LDAP> VIEWER '
    }
}
