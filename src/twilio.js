/**
 * dotcloud.js, a Javascript gateway library to powerful cloud services.
 * Copyright 2012 DotCloud Inc (Jr Prévost <jr@dotcloud.com>))
 *
 * This project is free software released under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 */

/**

    This module provides some basic bindngs with Twilio's API.

    @description
    It allows you to send text messages and make automated calls. Before you can use it you need to
    set up you api keys by <a href="http://js.dotcloud.com/#twilio">following the wizard</a> or
    making the following curl call.

    @example
    // to setup
    curl -d "sid=__ACCOUNT_SID__&token=__AUTH_TOKEN__" "http://api.jslib.dotcloud.com/twilio/setup"

    // to change
    curl -d "sid=__ACCOUNT_SID__&token=__AUTH_TOKEN__&newToken=__NEW_AUTH_TOKEN__" "http://api.jslib.dotcloud.com/twilio/setup"


    @name dotcloud.twilio
    @namespace

*/
define(function(require) {
    return function(config, io) {
        var twilio = {
            sid : null,
            /**
                Send a text message using Twilio's API.

                @description
                The callBack function cb will be call after the query to the twilio API has been made,
                not after the SMS has been sent.
                Twilio's API only supports sending SMS shorter than 160 characters.


                @public
                @name dotcloud.twilio#sendSMS
                @function
                @param {object} sms The object containning all the info about the SMS.
                @param {function} cb The callback called when the SMS has been added to the Twilio waiting list

                @throws An exception is thrown if the sms object is incomplete.

                @example
var sms = {
    To : The phone number to whom to send the SMS
    From : The phone number your are using to send the SMS
    Body : The content of the SMS limited to 160 characters
 };

 var callback = function(){
    console.log('SMS sent through twilio');
 };

twilio.sendSMS(sms, callback);

            */
            sendSMS: function(sms, cb) {
                if(!twilio.sid) throw "SID not defined";
                if(!sms)        throw "No SMS object given";
                if(!sms.From)   throw "No 'From' attribute in SMS object";
                if(!sms.To)     throw "No 'To' attribute in SMS object";
                if(!sms.Body)   throw "No 'Body' attribute in SMS object";
                if(sms.Body.length > 160)   throw "Twilio's SMS supports 20 more characters than twitter and nothing more.";

                io.call('twilio', 'sendSMS')(twilio.sid, sms, cb);
            },

            /**
                Make a call using Twilio's API.

                @description The CALL object must contain the following attributes.

                @public
                @name dotcloud.twilio#makeCall
                @function
                @param {object} call The object containning all the info about the call.
                @param {function} cb The callbacl function to be call when the call succeed.

                @throws An exception is thrown if the call object is uncomplete.

                @example
var call = {
    // The phone number to whom make the call
      To : ""
    // The phone number your are using make the call
    , From : ""
    // either give a string to be read by Twilio
    , say : "dotcloud JS love twilio"
    // or or direct TwiML
    , xml : '<?xml version="1.0" encoding="UTF-8" ?><Response><Say>dotcloud JS love twilio</Say></Response>'
}

var callback = function(){
    console.log('Call made through twilio');
};

twilio.makeCall(call, callback);
            */
            makeCall:  function(call, cb) {
                if(!twilio.sid) throw "SID not defined";
                if(!call)       throw "No CALL object given";
                if(!call.From)  throw "No 'From' attribute in CALL object";
                if(!call.To)    throw "No 'To' attribute in CALL object";
                if(!call.xml && !call.say)    throw "No 'xml' nor 'say' attribute in CALL object";
                if(call.xml && call.say)  throw "Only give 'xml' or 'say' attribute.";

                io.call('twilio', 'makeCall')(twilio.sid, call, cb);
            },
            /**
                Initialize the Twilio module using the provided Twilio secret ID.
                Enables the other methods in the module.
                @public
                @name dotcloud.twilio#init
                @function
                @param {String} sid your Twilio Secret ID

                @example
var apiSid = "AC66099c62ee19e782007f5fd4d1o8c2e7"; // your API SID should look like this
var twilio = dotcloud.twilio.init(apiSid));
            */
            init: function(sid) {
                this.sid = sid;
                return this;
            }

        };

        return twilio;
    };
});
