'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _loglevel = require('loglevel');

var log = _interopRequireWildcard(_loglevel);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var logger = log.getLogger('app-logger');

// TODO Make configurable via app.config.js, NODE_ENV or similiar.
logger.setLevel('DEBUG');

exports.default = logger;