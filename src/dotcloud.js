/**
 * dotcloud.js, a Javascript gateway library to powerful cloud services.
 * Copyright 2012 DotCloud Inc (Joffrey Fuhrer <joffrey@dotcloud.com>))
 *
 * This project is free software released under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 */
 
// dotcloud.js is provided as a *requirejs* module. For more information, you can visit
// <http://requirejs.org>
define(function(require) {
    var isReady = false;
    var readyCb = [];
    var self = {};

    var config = require('config');

    function ready() {
        var i = readyCb.length;
        while (--i >= 0) {
            readyCb[i](self);
        }
        isReady = true;
    }


    // When provided with a function parameter, `ready` will use it
    // as a callback when the `dotcloud` module is ready to be used.  
    // The module is provided as first (and only) argument of the callback.
    self.ready = function(fn) {
        if (fn instanceof Array) {
            readyCb = readyCb.concat(fn);
        } else {
            readyCb.push(fn);
        }
        if (isReady) {
            if (fn instanceof Array) {
                for (var i = 0, l = fn.length; i < l; i++) {
                    fn[i](self);
                }
            } else {
                fn(self);
            }
        }
            
    };

    // The dotcloud object is a namespace to several submodules loaded dynamically.  
    // Each submodule is documented on its own page.
    config.ready(function(config) {
        if (config.modules.DB_ENABLED) {
            // * [dotcloud.db](db.html) &mdash; Simple storage API
            self.db = require('db')(config);
        }

        if (config.modules.SYNC_ENABLED) {
            // * [dotcloud.sync](sync.html) &mdash; Synchronized storage API
            self.sync = require('sync')(config);
        }

        if (config.modules.TWITTER_ENABLED) {
            // * [dotcloud.twitter](twitter.html) &mdash; Twitter APIs
            self.twitter = require('twitter')(config);
        }

        if (config.modules.TWILIO_ENABLED) {
            // * [dotcloud.twilio](twilio.html) &mdash; Twilio APIs
            self.twilio = require('twilio')(config);
        }

        ready();
        isReady = true;
    });

    return self;
});
