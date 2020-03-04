"use strict";
//
// API - WS template
//
// Castellon.CH - 2019 (c)
// Author: Antonio Castellon - antonio@castellon.ch
//
const express     = require('express');
const vcs       = require('@acastellon/vcs');

const about = {
    about: {
        info: 'REST basic service ',
        author: {
            name: 'Antonio Castellon',
            email: 'antonio@castellon.ch'
        },
        version:  require('./package.json').version
    }
};

// -- version Control
vcs.getHash(__filename).then(function(value) { about.about.hash = value; });

var agentOptions = null;

//
// ROUTES
//

function setEndpoint(route, description) {
    let endPoint = route;
    endPoint.description = description;
    return endPoint;
}


function getRouter(options) {

    agentOptions = options; // in case that you need to use this options for a forwarding request to another service

    const router = express.Router();

    setEndpoint(router.route('/'), 'this is an Endpoint description').get(getAbout);

    return router;
}

module.exports.getRouter = getRouter;


//
// Business Logic
// tip: use ".catch(next)" at the end of any Promise to throw/return a common/generic error message (status 500 + info)

function getAbout(req, res, next) {
    return res.json(about);
}


