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
        version:  require('./package.json').version + ' , build: ' + vcs.getBuildFile('./build.txt')
    }
};

//
// ROUTES
//

function getRouter() {

    const router = express.Router();

    router.route('/').get(getAbout);

    return router;
}

module.exports.getRouter = getRouter;


//
// Business Logic
//

function getAbout(req, res, next) {
    return res.send(about);
}


