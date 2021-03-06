"use strict";
//
// Node.js script - Basic RESTful service
//
// Castellon.CH - 2019 (c)
// Author: Antonio Castellon - antonio@castellon.ch
//
//
const compression = require('compression')
const express     = require('express');
const fs          = require('fs');
const helmet      = require('helmet');  // security - https://github.com/helmetjs/helmet
const hpp         = require('hpp');     // security - https://github.com/analog-nico/hpp
const cookieParser      = require('cookie-parser');
const bodyParser        = require("body-parser");


module.exports = function(_SERVER, _AUTH, api) {

    const model = {};

    //
    // CONFIGURATION
    //

    const cors      = require('@acastellon/cors')(_SERVER.WHITELIST);
    const auth      = require('@acastellon/auth')(_AUTH);

    const app   = express();
    const os 	= require("os");
    const HOST  = os.hostname();

    const PORT  = process.env.PORT || _SERVER.PORT;

    // PREPARING ACESS SECURITY & FILTERINGS
    //
    app.use(compression());
    app.use(helmet());
    app.use(hpp());
    app.use(bodyParser.urlencoded({ extended: false })); // this module don't manage files
    app.use(bodyParser.json());
    app.use(cookieParser());

    cors.enableCORS(app);  // Headers + CORS

    if (_AUTH.AUTH_TYPE == 'NTLM') auth.setNTLMAuth(app);  // In case of Authentication based in NTLM, normally is related to the Server Web FrontEnd.
    else if (_AUTH.AUTH_TYPE == 'JWT' ) auth.validateToken(app); // this is the common usage for a WS (JWT)

    // SERVER CONNECTION
    //
    let options = {};

    if (_SERVER.CERTIFICATION_PATH) {
        options = {
            key: fs.readFileSync( _SERVER.CERTIFICATION_PATH + '/privateKey.pem' ), //private - openssl.exe pkcs12 -in rd-brdb.app.pmi.p12 -nocerts -out privateKey.pem
            cert: fs.readFileSync( _SERVER.CERTIFICATION_PATH + '/publicCert.pem' ), // public - openssl.exe pkcs12 -in rd-brdb.app.pmi.p12 -clcerts -nokeys -out publicCert.pem
            ca: fs.readFileSync( _SERVER.CERTIFICATION_PATH + '/ca.pem' ),
            requestCert: true,
            rejectUnauthorized: false,  // If true, the server certificate is verified against the list of supplied CAs. USE 'ca' parameter to use it ith strongest security
            passphrase: fs.readFileSync( _SERVER.CERTIFICATION_PATH + '/passphrase', "utf8" ).trim(),
            agent: false
        };
    }

    // ASSIGN ROUTING for the BUSINESS LOGIC
    //
    if (_SERVER.STATIC_PATH != null) {
        console.log(' ... WARNING: static path activated : ' +  process.cwd(0) + _SERVER.STATIC_PATH );
        app.use( '/', express.static(  process.cwd(0) + _SERVER.STATIC_PATH ) )  // __dirname == process.cwd(0)
    }

    app.use('/api', api.getRouter(options));
    app.use('/roles', function(req, res){ if (req.ntlm) { auth.getRoles(req, res); } else { res.json({})}; });
    app.use('/refresh/:userName', function (req, res){ auth.removeCache4(req.params.userName); res.json({})});

    app.use(function (err, req, res, next) {
        // handle error
        // in case that any method from API return a next, we can catch it here and return a BASIC common error message tot he client response
        res.status(500).json({ERROR: err});
    })

    app.use('/', function(req, res){

        let route, routes = [];

        app._router.stack.forEach(function(middleware){
            if(middleware.name === 'router'){ // router middleware
                middleware.handle.stack.forEach(function(handler){
                    route = handler.route;
                    routes.push({
                        path : route.path,
                        methods : route.methods,
                        description : route.description
                    });
                });
            }
        });
        res.json(routes);
    });

    function getApplication() {
        return app;
    }



    //
    // ASSIGNATIONS
    //

    model.run = run;
    model.getApplication = getApplication;


    //
    //  FUNCTION BODY
    //

    function run(cb) {

        let serverFactory;

        if (_SERVER.CERTIFICATION_PATH) { serverFactory = require('https');  }
        else { serverFactory = require('http'); }

        const server = serverFactory.createServer( options, app )
                            .listen( PORT, function () {
                                                            console.log( ' %s listening at %s ', HOST, PORT );
                                                            if (cb) cb();
                                                        } );

        server.on( 'error', (e) => {
            if (e.code == 'EADDRINUSE') {
                console.log( 'Address in use, retrying...' );
                setTimeout( () => {
                    server.close();
                    server.listen( PORT, HOST );
                }, 2000 );
            }
        } );
    }



    return model;
};



