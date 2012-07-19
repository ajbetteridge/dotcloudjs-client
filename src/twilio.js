/**
 * dotcloud.js, a Javascript gateway library to powerful cloud services.
 * Copyright 2012 DotCloud Inc (Jr Prévost <jr@dotcloud.com>))
 *
 * This project is free software released under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 */

/**

    This module provide some basic bindngs with Twilio's awesome API.

    @description
    It enable you to send SMS and send call. Before you can use it you need to set up you api keys
    <a href="http://js.dotcloud.com/#twilio">follow the wizard</a> or make the following curl call.

    @example
    // to setup
    curl -d "sid=__ACCOUNT_SID__&token=__AUTH_TOKEN__" http://api.jslib.dotcloud.com/twilio/setup

    // to change
    curl -d "sid=__ACCOUNT_SID__&token=__AUTH_TOKEN__&s;newToken=__NEW_AUTH_TOKEN__" http://api.jslib.dotcloud.com/twilio/setup


    @name dotcloud.twilio
    @class
    @param {String} sid you need to provide your Twilio Secret ID

*/ 
define(function(require) {
    return function(config, io) {
        var twilio = {
            sid : null,
            /**
                Sends a SMS using Twilio's API.

                @description
                The CallBack function cb will be call after the query to the twilio API has been made.
                And not after the SMS has been sent.
                Twilio API only support sending SMS shorter than 160 characters.

                
                @public
                @name dotcloud.twilio#sendSMS
                @function
                @param {object} sms The object containning all the info about the SMS.
                @param {function} cb The callback called when the SMS has been added to the Twilio waiting list

                @throws An exception is thrown if the sms object is uncomplete.

                @example
                var sms = {
                    To : The phone number to whom to send the SMS
                    From : The phone number your are using to send the SMS
                    Body : The content of the SMS limited to 160 characters
                 };

                 var callback = function(){
                    console.log('SMS sended thanks to twilio');
                 };

                 dotcloud.sendSMS(sms, callback);

            */
            sendSMS: function(sms, cb) {
                if(null== twilio.sid) throw "SID not defined";
                if(undefined == sms)        throw "No SMS object given";
                if(undefined == sms.From)   throw "No 'From' attribute in SMS object";
                if(undefined == sms.To)     throw "No 'To' attribute in SMS object";
                if(undefined == sms.Body)   throw "No 'Body' attribute in SMS object";
                if(sms.Body.length > 160)   throw "Twilio's SMS supports 20 more characters than twitter and nothing more."

                io.call('twilio', 'sendSMS')(twilio.sid, sms, cb);
            }

            /**
                Makes a Call using Twilio's API.

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
                    console.log('Call made thanks to twilio');
                 };

                 dotcloud.makeCall(call, callback);
            */
            makeCall:  function(call, cb) {
                if(undefined == call)       throw "No CALL object given";
                if(undefined == call.From)  throw "No 'From' attribute in CALL object";
                if(undefined == call.To)    throw "No 'To' attribute in CALL object";
                if(undefined == call.xml && undefined == call.say)    throw "No 'xml' nor 'say' attribute in CALL object";
                if(undefined !== call.xml && undefined !== call.say)  throw "Only give 'xml' or 'say' attribute.";
                
                io.call('twilio', 'makeCall')(twilio.sid, call, cb);
            }

        };
        return function(sid) {
            twilio.sid = sid;
            return twilio;
        };
    };
});
