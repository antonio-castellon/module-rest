"use strict";
//
// Node.js script - Basic RESTful service
//
// Castellon.CH - 2019-2026 (c)
// Author: Antonio Castellon - antonio@castellon.ch
//
const compression = require('compression');
const express     = require('express');
const fs          = require('fs');
const helmet      = require('helmet');
const hpp         = require('hpp');
const cookieParser = require('cookie-parser');

const constants   = require('crypto').constants;

module.exports = function(_SERVER, _AUTH, api) {

    const model = {};

    const cors      = require('@acastellon/cors')(_SERVER.WHITELIST);
    const auth      = require('@acastellon/auth')(_AUTH);

    const app   = express();
    const os    = require('os');
    const HOST  = os.hostname();

    const PORT  = process.env.PORT || _SERVER.PORT;

    const createStatic = require('@acastellon/connect-static');
    const cache =  {
        dir: process.cwd() + _SERVER.STATIC_PATH ,
        aliases: [
            ['/', '/index.html']
        ],
        followSymlinks: true,
        cacheControlHeader: 'max-age=3600, must-revalidate'
    };

    let options = {};

    app.use(compression());
    app.use(helmet( { contentSecurityPolicy: false } ));
    app.use(hpp());
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json({ limit: '50mb' }));
    app.use(cookieParser());

    cors.enableCORS(app);

    if (_AUTH.AUTH_TYPE == 'NTLM') auth.setNTLMAuth(app);
    else if (_AUTH.AUTH_TYPE == 'JWT' ) auth.validateToken(app);

    if (_SERVER.CERTIFICATION_PATH) {
        options = {
            key: fs.readFileSync( _SERVER.CERTIFICATION_PATH + '/privateKey.pem' ),
            cert: fs.readFileSync( _SERVER.CERTIFICATION_PATH + '/publicCert.pem' ),
            ca: fs.readFileSync( _SERVER.CERTIFICATION_PATH + '/ca.pem' ),
            requestCert: true,
            rejectUnauthorized: false,
            passphrase: fs.readFileSync( _SERVER.CERTIFICATION_PATH + '/passphrase', 'utf8' ).trim(),
            agent: false,
            secureOptions: constants.SSL_OP_NO_SSLv2 | constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_TLSv1 | constants.SSL_OP_NO_TLSv1_1
        };
    }

    if (_SERVER.STATIC_PATH != null) {
        console.log(' ... WARNING: static path activated : ' +  process.cwd() + _SERVER.STATIC_PATH );

        if (_SERVER.CACHE){
            console.log('...cache for static files activated');
            createStatic(cache, function (err, middleware) {
                if (err){
                    console.error(err);
                    throw err;
                }
                app.use('/', middleware);
                setRoutes(app);
            });
        }
        else{
            app.use( '/', express.static(  process.cwd() + _SERVER.STATIC_PATH ) );
            setRoutes(app);
        }
    }

    app.use('/api', api.getRouter(options));
    app.use('/roles', function(req, res){ if (req.ntlm) { auth.getRoles(req, res); } else { res.json({})}; });
    app.use('/refresh/:userName', function (req, res){ auth.removeCache4(req.params.userName); res.json({})});

    app.use(function (err, req, res, next) {
        console.log(' ////////// /////////////// INTERNAL EXCEPTION DETECTED ///////////////////// ');
        console.log(req.url);
        console.log(err);
        console.log(' ////////// /////////////// sending signal as 500 code with error message ///////////////////// ');
        res.status(500).json({ERROR: err});
    });

    app.enable('view cache');

    model.run = run;
    model.app = app;

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
            else {
                console.log('ACHTUNG! Unknown server error .... ');
                console.log(e);
            }
        } );
    }

    function setRoutes(app){
        app.use('/', function(req, res){
            let route, routes = [];

            app._router.stack.forEach(function(middleware){
                if(middleware.name === 'router'){
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
    }

    return model;
};
