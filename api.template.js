"use strict";
//
// API - WS template
//
// Castellon.CH - 2019-2026 (c)
// Author: Antonio Castellon - antonio@castellon.ch
//
const express = require('express');
const vcs = require('@acastellon/vcs');

const about = {
  about: {
    info: 'REST basic service ',
    author: {
      name: 'Antonio Castellon',
      email: 'antonio@castellon.ch'
    },
    version: require('./package.json').version
  }
};

vcs.getHash(__filename).then(function(value) { about.about.hash = value; });

var agentOptions = null;

function setEndpoint(route, description) {
  let endPoint = route;
  endPoint.description = description;
  return endPoint;
}

function getRouter(options) {
  agentOptions = options;
  const router = express.Router();
  setEndpoint(router.route('/'), 'this is an Endpoint description').get(getAbout);
  return router;
}

module.exports.getRouter = getRouter;

function getAbout(req, res, next) {
  return res.json(about);
}
