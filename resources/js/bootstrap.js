window._ = require('lodash');

window.axios = require('axios');

window.constants = require('./Admin/src/config/constants').default;

window.moment = require('moment');

window.cryptojs = require("crypto-js");

window.api = require('./Admin/src/repositories/api').default;

window.useAuth = require('./Admin/src/hooks/auth').default;

window.useHttp = require('./Admin/src/hooks/http').default;

window.helpers = require('./Admin/src/helpers').default;