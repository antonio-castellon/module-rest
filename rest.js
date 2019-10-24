"use strict";
//
// Node.js script - Basic RESTful service
//
// Castellon.CH - 2019 (c)
// Author: Antonio Castellon - antonio@castellon.ch
//
//
const express     = require('express');
const fs          = require('fs');
const https       = require('https');
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

    app.use(helmet());
    app.use(hpp());
    app.use(bodyParser.urlencoded({ extended: false })); // this module don't manage files
    app.use(bodyParser.json());
    app.use(cookieParser());

    cors.enableCORS(app);  // Headers + CORS

    // In case of Authentication based in NTLM, normally is related to the Server Web FrontEnd.
    if (_AUTH.AUTH_TYPE == 'NTLM') auth.setNTLMAuth(app);
    // this is the common usage for a WS (JWT)
    else if (_AUTH.AUTH_TYPE == 'JWT' ) auth.validateToken(app);

    // ASSIGN ROUTING for the BUSINESS LOGIC

    app.use('/', api.getRouter());

    // SERVER CONNECTION

    const options = {
        key: fs.readFileSync(_SERVER.CERTIFICATION_PATH + '/privateKey.pem'), //private - openssl.exe pkcs12 -in rd-brdb.app.pmi.p12 -nocerts -out privateKey.pem
        cert: fs.readFileSync(_SERVER.CERTIFICATION_PATH + '/publicCert.pem'), // public - openssl.exe pkcs12 -in rd-brdb.app.pmi.p12 -clcerts -nokeys -out publicCert.pem
        //ca: fs.readFileSync('ssl/ca/ca.crt'),
        requestCert:true,
        rejectUnauthorized: false,  // If true, the server certificate is verified against the list of supplied CAs. USE 'ca' parameter to use it ith strongest security
        passphrase: fs.readFileSync(_SERVER.CERTIFICATION_PATH + '/passphrase', "utf8").trim(),
        agent: false
    };


    //
    // ASSIGNATIONS
    //

    model.run = run;


    //
    //  FUNCTION BODY
    //

    function run(cb) {

        const server = https.createServer( options, app )
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



