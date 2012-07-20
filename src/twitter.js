/**
 * dotcloud.js, a Javascript gateway library to powerful cloud services.
 * Copyright 2012 DotCloud Inc (Joffrey Fuhrer <joffrey@dotcloud.com>))
 *
 * This project is free software released under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 */

/**
    Sub-module providing the Twitter API 
    
    @description
    REST API, Search API and Streaming API are supported. Bindings are
    mostly done one-to-one on REST endpoints.  
    Also provides a simplified oauth mechanism (see OAuth section).  
    Parameters that identify a user can be given either a `screen_name` or a `user_id`.
    To avoid ambiguity, `screen_name`s can be prefixed with "@"

    @name dotcloud.twitter
    @class
*/
define(function(require) {
    return function(config, io) {
        var appService = null, accessToken = null, appKey;
        var transfer = function(name, args, noauth) {
            if (!appService) throw 'Twitter service was not initialized.';
            args = Array.prototype.slice.call(args);
            noauth || args.unshift(accessToken);
            io.call(appService, name).apply(undefined, args);
        };

        var module = {
            /** 
                Initializes the twitter service for the twitter application identified
                by its consumer *key*.
                
                @description
                The consumer secret has to be provided **once** and will
                be persisted safely on the server. It should not be exposed in released code!  
                For quick testing, the *token* parameter can also be provided with an 
                access token object containing a key and secret.

                @public
                @name dotcloud.twitter#init
                @function
                @param {String} key 
                @param {String} [Secret]
                @param {Function} [callback]

                @example
// with the key and secret already <a href="http://js.dotcloud.com/#twitter">setup</a>
twitter.init('AZEaeaazeaEAEsqSDAE', function(){
    // let's use dotcloud JS's Twitter module
});
            */
            init: function(key, secret, token, cb) {
                if (typeof secret == 'function') {
                    cb = secret, token = null, secret = null;
                } else if (typeof token == 'function') {
                    cb = token, token = null;
                    if (typeof secret != 'string') {
                        token = secret, secret = null;
                    }
                    
                }

                io.call('twitter', 'init')(key, secret, token, function(svcName) {
                    if (svcName.error) {
                        if (typeof svcName.error == 'string') {
                            throw svcName.error;
                        } else {
                            throw JSON.stringify(svcName.error);
                        }
                    } else {
                        appKey = key;
                        appService = svcName;
                        cb && cb();
                    }
                });
            },
            
            /**
                Timelines.

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/statuses/home_timeline">GET /statuses/home\_timeline</a>, <a href="https://dev.twitter.com/docs/api/1/GET/statuses/user_timeline">GET /statuses/user\_timeline</a>  
                
                @public
                @name dotcloud.twitter#timeline
                @function
                @param {Sring} [type] can be either "user" or "home". Defaults to "home".
                @param {Object} [params] can be provided as specified <a href="https://dev.twitter.com/docs/api/1/get/statuses/user_timeline">here</a>,
                <a href="https://dev.twitter.com/docs/api/1/get/statuses/home_timeline">here</a>
                @param {Function} cb
            */
            timeline: function(type, params, cb) {
                transfer('timeline', arguments);
            },

            /**
                Mentions.

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/statuses/mentions">GET /statuses/mentions</a>

                @public
                @name dotcloud.twitter#mentions
                @function
                @param {Sring} [type] 
                @param {Object} [params] can be provided as specified <a href="https://dev.twitter.com/docs/api/1/get/statuses/mentions">here</a>
                @param {Function} cb 
            */
            mentions: function(params, cb) {
                transfer('mentions', arguments);
            },

            /**
                Retweets Timeline.

                @description

                @public
                @name dotcloud.twitter#retweetsTimeline
                @function
                @param {Sring} [type] Can be one of `[by, to, of]`
                @param {Sring} [user] Is a `user_id` or a `screen_name`. The values `"me"` and `null` will retrieve the
             timeline for the authenticated user. 
                @param {Object} [params] can be provided as specified <a href="https://dev.twitter.com/docs/api/1/get/statuses/retweeted_by_user">here</a>
                @param {Function} cb 
            */
            retweetsTimeline: function(type, user, params, cb) {
                transfer('retweetsTimeline', arguments);
            },

            /**
                Retweeters
            
                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/statuses/:id/retweeted_by">GET /statuses/:id/retweeted\_by</a>,
                <a href="https://dev.twitter.com/docs/api/1/GET/statuses/:id/retweeted_by/ids">GET /statuses/:id/retweeted\_by/ids</a> 

                @public
                @name dotcloud.twitter#retweeters
                @function
                @param {Sring} [id] Is the status id whose retweeters you want to look up.
                @param {Boolean} [ids] is a boolean. If set to true, an array of `user_id`s will be returned.
                @param {Object} [params] As specified <a href="https://dev.twitter.com/docs/api/1/get/statuses/%3Aid/retweeted_by">here</a>
                @param {Function} cb 
            */
            retweeters: function(id, ids, params, cb) {
                transfer('retweeters', arguments);
            },
  
            /**
                Retweets

                @description 
                <a href="https://dev.twitter.com/docs/api/1/GET/statuses/retweets/:id">GET /statuses/retweets/:id</a>  

                @public
                @name dotcloud.twitter#retweets
                @function
                @param {Sring} [id] is the status id for which you want to find retweets.
                @param {Object} [params] As specified <a href="https://dev.twitter.com/docs/api/1/get/statuses/%3Aid/retweets">here</a>
                @param {Function} cb 
            */
            retweets: function(id, params, cb) {
                transfer('retweets', arguments);
            },
            /**
                showStatus

                @description
                <a href="GET /statuses/show/:id">https://dev.twitter.com/docs/api/1/GET/statuses/show/:id</a>

                @public
                @name dotcloud.twitter#showStatus
                @function
				@param {Sring} id Is the status id for which you want to find retweets. 
				@param {Object} [params] As specified <a href="https://dev.twitter.com/docs/api/1/get/statuses/%3Aid/show">here</a>
                @param {Function} cb
            */   
            showStatus: function(id, params, cb) {
                transfer('showStatus', arguments);
            },
            /**
                destroyStatus

                @description
                <a href="https://dev.twitter.com/docs/api/1/POST/statuses/destroy/:id">POST /statuses/destroy/:id</a>

                @public
                @name dotcloud.twitter#destroyStatus
                @function
				@param {String} id is the id of the status you want to destroy.
				@param {Function} cb
 
            */ 
            destroyStatus: function(id, cb) {
                transfer('destroyStatus', arguments);
            },

            /**
                updateStatus

                @description
                <a href="https://dev.twitter.com/docs/api/1/POST/statuses/update">POST /statuses/update</a>

                @public
                @name dotcloud.twitter#updateStatus
                @function
				@param {String} status Is the status (tweet) you want to post.
				@param {Object} [params] As specified <a href="https://dev.twitter.com/docs/api/1/post/statuses/update">here</a>
				@param {Function} cb
            */ 
            updateStatus: function(status, params, cb) {
                transfer('updateStatus', arguments);
            },

            /**
                retweetStatus

                @description
                <a href="https://dev.twitter.com/docs/api/1/POST/statuses/retweet/:id">POST /statuses/retweet/:id</a>

                @public
                @name dotcloud.twitter#retweetStatus
                @function
				@param {String} id Is the id of the status you want to retweet.
				@param {Function} cb
            */  
 
            retweetStatus: function(id, cb) {
                transfer('retweetStatus', arguments);
            },

            /**
                Direct messages

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/direct_messages">GET /direct\_messages</a>

                @public
                @name dotcloud.twitter#receivedDMs
                @function
				@param {String} [params] As specified <a href="https://dev.twitter.com/docs/api/1/get/direct_messages">here</a>
				@param {Function} cb
            */  
            //   
            // 
            receivedDMs: function(params, cb) {
                transfer('receivedDMs', arguments);
            },

            /**
                sentDMs

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/direct_messages/sent">GET /direct\_messages/sent</a>

                @public
                @name dotcloud.twitter#sentDMs
                @function
				@param {String} [params] As specified <a href="https://dev.twitter.com/docs/api/1/get/direct_messages/sent">here</a>
				@param {Function} cb

            */  
            //    
            sentDMs: function(params, cb) {
                transfer('sentDMs', arguments);
            },

            /**
                destroyDM

                @description
                <a href="https://dev.twitter.com/docs/api/1/POST/direct_messages/:id/destroy">POST /direct\_messages/:id/destroy</a>

                @public
                @name dotcloud.twitter#destroyDM
                @function
				@param {String} id Is the id of the message you want to destroy.
				@param {Function} cb
            */
            destroyDM: function(id, cb) {
                transfer('destroyDM', arguments);
            },

            /**
                newDM

                @description
                <a href="https://dev.twitter.com/docs/api/1/POST/direct_messages/new">POST /direct\_messages/new</a>

                @public
                @name dotcloud.twitter#newDM
                @function
				@param {String} user Can be either a `user_id` or `screen_name` indicating the recipient
				@param {String} Text is the content of the message to be sent.
				@param {String} [params] as specified <a href="https://dev.twitter.com/docs/api/1/post/direct_messages/new">here</a>
                @param {Function} cb 
            */
            newDM: function(user, text, params, cb) {
                transfer('newDM', arguments);
            },

            // ### 
            /**
                Friends/followers

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/followers/ids">GET /followers/ids</a>

                @public
                @name dotcloud.twitter#followers
                @function
				@param {String} user can be either a `user_id` or `screen_name` indicating whose followers
				@param {String} [params] As specified <a href="https://dev.twitter.com/docs/api/1/get/followers/ids">here</a>
				@param {Function} cb
            */  
            //   
            // *user* 
            // to get.  
            // *params* 
            followers: function(user, params, cb) {
                transfer('followers', arguments);
            },
            /**
                friends

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/friends/ids">GET /friends/ids</a>

                @public
                @name dotcloud.twitter#friends
                @function
				@param {String} user
				@param {Object} [params]
				@param {Function} cb
				 
            */  
            // *user* can be either a `user_id` or `screen_name` indicating whose friends
            // to get.  
            // *params* as specified <a href="https://dev.twitter.com/docs/api/1/get/friends/ids">here</a>
            friends: function(user, params, cb) {
                transfer('friends', arguments);
            },
            /**
                areFriends

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/friendships/exists">GET /friendships/exists</a>

                @public
                @name dotcloud.twitter#areFriends
                @function
				@param {String} userA
				@param {String} userB
				@param {Function} cb
				 
            */  
            // *userA* and *userB* can be `user_id` or `screen_name`.  
            // Will return true if userA follows userB, false otherwise.
            areFriends: function(userA, userB, cb) {
                transfer('areFriends', arguments);
            },
            /**
                friendshipsIn

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/friendships/incoming">GET /friendships/incoming</a>

                @public
                @name dotcloud.twitter#friendshipsIn
                @function
				@param {Object} [params]
				@param {Function} cb 
				 
            */  
            // *params* as specified <a href="https://dev.twitter.com/docs/api/1/get/friendships/incoming">here</a>
            friendshipsIn: function(params, cb) {
                transfer('friendshipsIn', arguments);
            },
            /**
                friendshipsOut

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/friendships/outgoing">GET /friendships/outgoing</a>

                @public
                @name dotcloud.twitter#friendshipsOut
                @function
				@param {Object} [params]
				@param {Function} cb 
				 
            */  
            // *params* as specified <a href="https://dev.twitter.com/docs/api/1/get/friendships/outgoing">here</a>
            friendshipsOut: function(params, cb) {
                transfer('friendshipsOut', arguments);
            },
            /**
                showFriendship

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/friendships/show">GET /friendships/show</a>

                @public
                @name dotcloud.twitter#showFriendship
                @function
				@param {Object} source
				@param {Object} target
				@param {Function} cb
				 
            */  
            // *source* and *target* can be either `user_id` or `screen_name`.
            showFriendship: function(source, target, cb) {
                transfer('showFriendship', arguments);
            },
            /**
                createFriendship

                @description
                <a href="https://dev.twitter.com/docs/api/1/POST/friendships/create">POST /friendships/create</a>

                @public
                @name dotcloud.twitter#createFriendship
                @function
				@param {String} user
				@param {Object} follow
				@param {Function} cb
				 
            */  
            // *user* can be either a `screen_name` or `user_id`  
            // *follow* is a boolean that, if set to true, will enable notifications
            // for the target user.
            createFriendship: function(user, follow, cb) {
                transfer('createFriendship', arguments);
            },
            /**
                destroyFriendship

                @description
                <a href="https://dev.twitter.com/docs/api/1/POST/friendships/destroy">POST /friendships/destroy</a>

                @public
                @name dotcloud.twitter#destroyFriendship
                @function
				@param {String} user
				@param {Function} cb 
				 
            */  
            // *user* can be either a `screen_name` or `user_id`
            destroyFriendship: function(user, cb) {
                transfer('destroyFriendship', arguments);
            },
            /**
                lookupFriendships

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/friendshups/lookup">GET /friendshups/lookup</a>

                @public
                @name dotcloud.twitter#lookupFriendships
                @function
				@param {String} users
				@param {Function} cb 
				 
            */  
            // *users* is an array of `screen_name`s or `user_id`s
            lookupFriendships: function(users, cb) {
                transfer('lookupFriendships', arguments);
            },
            /**
                updateFriendship

                @description
                <a href="https://dev.twitter.com/docs/api/1/POST/friendships/update">POST /friendships/update</a>

                @public
                @name dotcloud.twitter#updateFriendship
                @function
				@param {String} user
				@param {Object} devicets
				@param {Object} retweets
				 
            */  
            // *user* can be either a `screen_name` or `user_id`  
            // *device* is a boolean that enables/disables notifications 
            // from target user. Pass in null to leave unchanged.  
            // *retweets* is a boolean that enables/disables retweets from
            // target user. Pass in null to leave unchanged.
            updateFriendship: function(user, device, retweets, cb) {
                transfer('updateFriendship', arguments);
            },

            // ### Users
            /**
                lookupUsers

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/users/lookup">GET /users/lookup</a>

                @public
                @name dotcloud.twitter#lookupUsers
                @function
				@param {String} users
				@param {Function} cb 
				 
            */  
            // *users* is an array of `screen_name`s or `user_id`s
            lookupUsers: function(users, cb) {
                transfer('lookupUsers', arguments);
            },
            /**
                searchUsers

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/users/search">GET /users/search</a>

                @public
                @name dotcloud.twitter#searchUsers
                @function
				@param {Object} query
				@param {Object} [params]
				@param {Function} cb
				 
            */  
            // *query* is the search query to execute.  
            // *params* as specified <a href="https://dev.twitter.com/docs/api/1/get/users/search">here</a>
            searchUsers: function(query, params, cb) {
                transfer('searchUsers', arguments);
            },
            /**
                showUser

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/users/show">GET /users/show</a>

                @public
                @name dotcloud.twitter#showUser
                @function
				@param {String} user
				@param {Object} [params]
				@param {Function} cb
				 
            */  
            // *user* can be either a `screen_name` or `user_id`  
            // *params* as specified <a href="https://dev.twitter.com/docs/api/1/get/users/show">here</a>
            showUser: function(user, params, cb) {
                transfer('showUser', arguments);
            },
            /**
                contributees

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/users/contributees">GET /users/contributees</a>

                @public
                @name dotcloud.twitter#contributees
                @function
				@param {String} user
				@param {Object} [params]
				@param {Function} cb
				 
            */  
            // *user* can be either a `screen_name` or `user_id`  
            // *params* as specified <a href="https://dev.twitter.com/docs/api/1/get/users/contributees">here</a>
            contributees: function(user, params, cb) {
                transfer('contributees', arguments);
            },
            /**
                contributors

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/users/contributors">GET /users/contributors</a>

                @public
                @name dotcloud.twitter#contributors
                @function
				@param {String} user
				@param {Object} [params]
				@param {Function} cb
				 
            */  
            // *user* can be either a `screen_name` or `user_id`  
            // *params* as specified <a href="https://dev.twitter.com/docs/api/1/get/users/contributors">here</a>
            contributors: function(user, params, cb) {
                transfer('contributors', arguments);
            },
            /**
                suggestionCategories

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/users/suggestions">GET /users/suggestions</a>

                @public
                @name dotcloud.twitter#suggestionCategories
                @function
				@param {Object} [lang]
				@param {Function} cb 
				 
            */  
            // *lang* is a two-letter language code, defaults to `en`.
            suggestionCategories: function(lang, cb) {
                transfer('suggestionCategories', arguments);
            },
            /**
                suggestions

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/users/suggestions/:slug">GET /users/suggestions/:slug</a>

                @public
                @name dotcloud.twitter#suggestions
                @function
				@param {Object} slug
				@param {Object} [members]
				@param {Object} [lang]
				 
            */, <a href="https://dev.twitter.com/docs/api/1/GET/users/suggestions/:slug/members">GET /users/suggestions/:slug/members</a>  
            // *slug* is the slug identifier for the suggestion category.  
            // *members* is a boolean indicating if the most recent status of suggested users
            // should be included in the response. Defaults to false.  
            // *lang* is a two-letter language code, defaults to `en`.
            suggestions: function(slug, members, lang, cb) {
                transfer('suggestions', arguments);
            },

            // ### Block
            /**
                blocking

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/blocks/blocking">GET /blocks/blocking</a>

                @public
                @name dotcloud.twitter#blocking
                @function
				@param {Object} [params]
				@param {Object} [ids]
				@param {Function} cb
				 
            */, <a href="https://dev.twitter.com/docs/api/1/GET/blocks/blocking/ids">GET /blocks/blocking/ids</a>  
            // *ids* - if true, return an array of user ids instead of full user objects  
            // *params* as specified <a href="https://dev.twitter.com/docs/api/1/get/blocks/blocking">here</a>
            blocking: function(params, ids, cb) {
                transfer('blocking', arguments);
            },
            /**
                isBlocked

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/blocks/exists">GET /blocks/exists</a>

                @public
                @name dotcloud.twitter#isBlocked
                @function
				@param {String} user
				@param {Object} [params]
				@param {Function} cb
				 
            */  
            // *user* can be either a `screen_name` or `user_id`  
            // *params* as specified <a href="https://dev.twitter.com/docs/api/1/get/blocks/exists">here</a>
            isBlocked: function(user, params, cb) {
                transfer('isBlocked', arguments);
            },
            /**
                createBlock

                @description
                <a href="https://dev.twitter.com/docs/api/1/POST/blocks/create">POST /blocks/create</a>

                @public
                @name dotcloud.twitter#createBlock
                @function
				@param {String} user
				@param {Object} [params]
				@param {Function} cb
				 
            */  
            // *user* can be either a `screen_name` or `user_id`  
            // *params* as specified <a href="https://dev.twitter.com/docs/api/1/post/blocks/create">here</a>
            createBlock: function(user, params, cb) {
                transfer('createBlock', arguments);
            },
            /**
                destroyBlock

                @description
                <a href="https://dev.twitter.com/docs/api/1/POST/blocks/destroy">POST /blocks/destroy</a>

                @public
                @name dotcloud.twitter#destroyBlock
                @function
				@param {String} user
				@param {Object} [params]
				@param {Function} cb
				 
            */  
            // *user* can be either a `screen_name` or `user_id`  
            // *params* as specified <a href="https://dev.twitter.com/docs/api/1/post/blocks/destroy">here</a>
            destroyBlock: function(user, params, cb) {
                transfer('destroyBlock', arguments);
            },

            // ### Favorites
            /**
                favorites

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/favorites">GET /favorites</a>

                @public
                @name dotcloud.twitter#favorites
                @function
				@param {String} user
				@param {Object} [params]
				@param {Function} cb
				 
            */
            // *user* can be either a `screen_name` or `user_id`  
            // *params* as specified <a href="https://dev.twitter.com/docs/api/1/get/favorites">here</a>
            favorites: function(user, params, cb) {
                transfer('favorites', arguments);
            },
            /**
                createFavorite

                @description
                <a href="https://dev.twitter.com/docs/api/1/POST/favorites/create/:id">POST /favorites/create/:id</a>

                @public
                @name dotcloud.twitter#createFavorite
                @function
				@param {String} id
				@param {Function} cb 
				 
            */  
            // *id* is the identifier for the tweet to be added to favorites.
            createFavorite: function(id, cb) {
                transfer('createFavorite', arguments);
            },
            /**
                destroyFavorite

                @description
                <a href="https://dev.twitter.com/docs/api/1/POST/favorites/destroy/:id">POST /favorites/destroy/:id</a>

                @public
                @name dotcloud.twitter#destroyFavorite
                @function
				@param {String} id
				@param {Function} cb 
				 
            */  
            // *id* is the identifier for the tweet to be removed from favorites.
            destroyFavorite: function(id, cb) {
                transfer('destroyFavorite', arguments);
            },

            // ### Lists
            /**
                allLists

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/lists/all">GET /lists/all</a>

                @public
                @name dotcloud.twitter#allLists
                @function
				@param {Object} [user]
				@param {Function} cb 
				 
            */  
            // *user* can be either a `screen_name` or `user_id`. If ommitted, 
            // defaults to the currently authenticated user.  
            allLists: function(user, cb) {
                transfer('allLists', arguments);
            },

            /**
                listStatuses

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/lists/statuses">GET /lists/statuses</a>

                @public
                @name dotcloud.twitter#listStatuses
                @function
				@param {Object} list
				@param {Object} [owner]
				@param {Object} [params]
				 
            */  
            // *list* can be either a list ID or a slug, in which case the
            // *owner* parameter is required.
            // *owner* can be either a `screen_name` or `user_id`.  
            // *params* as specified <a href="https://dev.twitter.com/docs/api/1/get/lists/statuses">here</a>
            listStatuses: function(list, owner, params, cb) {
                transfer('listStatuses', arguments);
            },

            /**
                listSubscriptions

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/lists/subscriptions">GET /lists/subscriptions</a>

                @public
                @name dotcloud.twitter#listSubscriptions
                @function
				@param {String} user
				@param {Object} [params]
				@param {Function} cb
				 
            */  
            // *user* can be either a `screen_name` or `user_id`.  
            // *params* as specified <a href="https://dev.twitter.com/docs/api/1/get/lists/subscriptions">here</a>
            listSubscriptions: function(user, params, cb) {
                transfer('listSubscriptions', arguments);
            },

            /**
                listSubscribers

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/lists/subscribers">GET /lists/subscribers</a>

                @public
                @name dotcloud.twitter#listSubscribers
                @function
				@param {Object} list
				@param {Object} [owner]
				@param {Object} [params]
				 
            */  
            // *list* can be either a list ID or a slug, in which case the
            // *owner* parameter is required.  
            // *owner* can be either a `screen_name` or `user_id`.  
            // *params* as specified <a href="https://dev.twitter.com/docs/api/1/get/lists/subscribers">here</a>
            listSubscribers: function(list, owner, params, cb) {
                transfer('listSubscribers', arguments);
            },

            /**
                listSubscribe

                @description
                <a href="https://dev.twitter.com/docs/api/1/POST/lists/subscribers/create">POST /lists/subscribers/create</a>

                @public
                @name dotcloud.twitter#listSubscribe
                @function
				@param {Object} list
				@param {Object} [owner]
				@param {Function} cb
				 
            */  
            // *list* can be either a list ID or a slug, in which case the
            // *owner* parameter is required.  
            // *owner* can be either a `screen_name` or `user_id`.  
            listSubscribe: function(list, owner, cb) {
                transfer('listSubscribe', arguments);
            },

            /**
                isListSubscriber

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/lists/subscribers/show">GET /lists/subscribers/show</a>

                @public
                @name dotcloud.twitter#isListSubscriber
                @function // list, [owner], user, [params], cb
 
            */  
            // *list* can be either a list ID or a slug, in which case the
            // *owner* parameter is required.  
            // *owner* can be either a `screen_name` or `user_id`.  
            // *user* can be either a `screen_name` or `user_id`.  
            // *params* as specified <a href="https://dev.twitter.com/docs/api/1/get/lists/subscribers/show">here</a>
            isListSubscriber: function(list, owner, user, params, cb) {
                transfer('isListSubscriber', arguments);
            },

            /**
                listUnsubscribe

                @description
                <a href="https://dev.twitter.com/docs/api/1/POST/lists/subscribers/destroy">POST /lists/subscribers/destroy</a>

                @public
                @name dotcloud.twitter#listUnsubscribe
                @function
				@param {Object} list
				@param {Object} [owner]
				@param {Function} cb
				 
            */  
            // *list* can be either a list ID or a slug, in which case the
            // *owner* parameter is required.  
            // *owner* can be either a `screen_name` or `user_id`.  
            listUnsubscribe: function(list, owner, cb) {
                transfer('listUnsubscribe', arguments);
            },

            /**
                listMemberships

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/lists/memberships">GET /lists/memberships</a>

                @public
                @name dotcloud.twitter#listMemberships
                @function
				@param {String} user
				@param {Object} [params]
				@param {Function} cb
				 
            */  
            // *user* can be either a `screen_name` or `user_id`.  
            // *params* as specified <a href="https://dev.twitter.com/docs/api/1/get/lists/memberships">here</a>
            listMemberships: function(user, params, cb) {
                transfer('listMemberships', arguments);
            },

            /**
                listMembers

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/lists/members">GET /lists/members</a>

                @public
                @name dotcloud.twitter#listMembers
                @function
				@param {Object} list
				@param {Object} [owner]
				@param {Object} [params]
				 
            */  
            // *list* can be either a list ID or a slug, in which case the
            // *owner* parameter is required.  
            // *owner* can be either a `screen_name` or `user_id`.  
            // *params* as specified <a href="https://dev.twitter.com/docs/api/1/get/lists/members">here</a>
            listMembers: function(list, owner, params, cb) {
                transfer('listMembers', arguments);
            },

            /*
                addMember

                @description
                <a href="https://dev.twitter.com/docs/api/1/POST/lists/members/create">POST /lists/members/create</a>

                @public
                @name dotcloud.twitter#addMember
                @function
				@param {Object} list
				@param {Object} [owner]			@param {String} user
				 
            */, <a href="https://dev.twitter.com/docs/api/1/POST/lists/members/create_all">POST /lists/members/create\_all</a>  
            // *list* can be either a list ID or a slug, in which case the
            // *owner* parameter is required.  
            // *owner* can be either a `screen_name` or `user_id`.  
            // *user* can be either a `screen_name` or `user_id`. Alternatively, 
            // if an array is provided, the create_all endpoint will be used.
            addMember: function(list, owner, user, cb) {
                transfer('addMember', arguments);
            },

            /**
                isListMember

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/lists/members/show">GET /lists/members/show</a>

                @public
                @name dotcloud.twitter#isListMember
                @function // list, [owner], user, [params], cb
 
            */  
            // *list* can be either a list ID or a slug, in which case the
            // *owner* parameter is required.  
            // *owner* can be either a `screen_name` or `user_id`.  
            // *user* can be either a `screen_name` or `user_id`.  
            // *params* as specified <a href="https://dev.twitter.com/docs/api/1/get/lists/members/show">here</a>
            isListMember: function(list, owner, user, params, cb) {
                transfer('isListMember', arguments);
            },

            /**
                removelistMember

                @description
                <a href="https://dev.twitter.com/docs/api/1/POST/lists/members/destroy">POST /lists/members/destroy</a>

                @public
                @name dotcloud.twitter#removelistMember
                @function
				@param {Object} list
				@param {Object} [owner]			@param {String} user
				 
            */, <a href="https://dev.twitter.com/docs/api/1/POST/lists/members/destroy_all">POST /lists/members/destroy\_all</a>  
            // *list* can be either a list ID or a slug, in which case the
            // *owner* parameter is required.  
            // *owner* can be either a `screen_name` or `user_id`.  
            // *user* can be either a `screen_name` or `user_id`. Alternatively, 
            // if an array is provided, the destroy\_all endpoint will be used.
            removeListMember: function(list, owner, user, cb) {
                transfer('removeListMember', arguments);
            },

            /**
                createList

                @description
                <a href="https://dev.twitter.com/docs/api/1/POST/lists/create">POST /lists/create</a>

                @public
                @name dotcloud.twitter#createList
                @function
				@param {Object} name
				@param {Object} mode
				@param {Object} [desc]
				 
            */  
            // *name* Name of the list to be created.  
            // *mode* one of "private", "public".  
            // *desc* Optional list description.
            createList: function(name, mode, desc, cb) {
                transfer('createList', arguments);
            },

            /**
                destroyList

                @description
                <a href="https://dev.twitter.com/docs/api/1/POST/lists/destroy">POST /lists/destroy</a>

                @public
                @name dotcloud.twitter#destroyList
                @function
				@param {Object} list
				@param {Object} [owner]
				@param {Function} cb
				 
            */  
            // *list* can be either a list ID or a slug, in which case the
            // *owner* parameter is required.  
            // *owner* can be either a `screen_name` or `user_id`.  
            destroyList: function(list, owner, cb) {
                transfer('destroyList', arguments);
            },

            /**
                updateList

                @description
                <a href="https://dev.twitter.com/docs/api/1/POST/lists/update">POST /lists/update</a>

                @public
                @name dotcloud.twitter#updateList
                @function
				@param {Object} list
				@param {Object} [owner]
				@param {Object} update
				 
            */  
            // *list* can be either a list ID or a slug, in which case the
            // *owner* parameter is required.  
            // *owner* can be either a `screen_name` or `user_id`.  
            // *update* an object containing (optionally) `mode`, `name` and 
            // `description` keys
            updateList: function(list, owner, update, cb) {
                transfer('updateList', arguments);
            },

            /**
                lists

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/lists">GET /lists</a>

                @public
                @name dotcloud.twitter#lists
                @function
				@param {String} user
				@param {Object} [cursor]
				@param {Function} cb
				 
            */  
            // *user* can be either a `screen_name` or `user_id`.  
            // *cursor* integer that can be used to break the results into pages.
            // If ommitted, the result will be sent in one single chunk.
            lists: function(user, cursor, cb) {
                transfer('lists', arguments);
            },

            /**
                showList

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/lists/show">GET /lists/show</a>

                @public
                @name dotcloud.twitter#showList
                @function
				@param {Object} list
				@param {Object} [owner]
				@param {Function} cb
				 
            */  
            // *list* can be either a list ID or a slug, in which case the
            // *owner* parameter is required.  
            // *owner* can be either a `screen_name` or `user_id`.  
            showList: function(list, owner, cb) {
                transfer('showList', arguments);
            },

            // ### Accounts
            /**
                rateLimit

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/account/rate_limit_status">GET /account/rate\_limit\_status</a>

                @public
                @name dotcloud.twitter#rateLimit
                @function
				@param {Function} cb
				 
            */
            rateLimit: function(cb) {
                transfer('rateLimit', arguments);
            },
            /**
                verifyCredentials

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/account/verify_credentials">GET /account/verify\_credentials</a>

                @public
                @name dotcloud.twitter#verifyCredentials
                @function
				@param {Function} cb
				 
            */
            verifyCredentials: function(cb) {
                transfer('verifyCredentials', arguments);
            },

            /**
                endSession

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/account/end_session">GET /account/end\_session</a>

                @public
                @name dotcloud.twitter#endSession
                @function
				@param {Function} cb
				 
            */
            endSession: function(cb) {
                transfer('endSession', arguments);
            },
            /**
                updateProfile

                @description
                <a href="https://dev.twitter.com/docs/api/1/POST/account/update_profile">POST /account/update\_profile</a>

                @public
                @name dotcloud.twitter#updateProfile
                @function
				@param {Object} params
				@param {Function} cb 
				 
            */  
            // *params* as specified <a href="https://dev.twitter.com/docs/api/1/post/account/update_profile">here</a>
            updateProfile: function(params, cb) {
                transfer('updateProfile', arguments);
            },
            /**
                updateBackgroundImg

                @description
                <a href="https://dev.twitter.com/docs/api/1/POST/account/update_profile_background_image">POST /account/update\_profile\_background\_image</a>

                @public
                @name dotcloud.twitter#updateBackgroundImg
                @function
				@param {Object} image
				@param {Object} [params]
				@param {Function} cb
				 
            */  
            // *image* image data, base-64 encoded.  
            // *params* as specified <a href="https://dev.twitter.com/docs/api/1/post/account/update_profile_background_image">here</a>
            updateBackgroundImg: function(image, params, cb) {
                transfer('updateBackgroundImg', arguments);
            },
            /**
                updateProfileImg

                @description
                <a href="https://dev.twitter.com/docs/api/1/POST/account/update_profile_image">POST /account/update\_profile\_image</a>

                @public
                @name dotcloud.twitter#updateProfileImg
                @function
				@param {Object} image
				@param {Object} [params]
				@param {Function} cb
				 
            */  
            // *image* image data, base-64 encoded.  
            // *params* as specified <a href="https://dev.twitter.com/docs/api/1/post/account/update_profile_image">here</a>
            updateProfileImg: function(image, params, cb) {
                transfer('updateProfileImg', arguments);
            },
            /**
                updateProfileColors

                @description
                <a href="https://dev.twitter.com/docs/api/1/POST/account/update_profile_colors">POST /account/update\_profile\_colors</a>

                @public
                @name dotcloud.twitter#updateProfileColors
                @function
				@param {Object} params
				@param {Function} cb 
				 
            */  
            // *params* as specified <a href="https://dev.twitter.com/docs/api/1/post/account/update_profile_colors">here</a>
            updateProfileColors: function(params, cb) {
                transfer('updateProfileColors', arguments);
            },

            /**
                accountTotals

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/account/totals">GET /account/totals</a>

                @public
                @name dotcloud.twitter#accountTotals
                @function
				@param {Function} cb
				 
            */
            accountTotals: function(cb) {
                transfer('accountTotals', arguments);
            },

            /**
                settings

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/account/settings">GET /account/settings</a>

                @public
                @name dotcloud.twitter#settings
                @function
				@param {Function} cb
				 
            */
            settings: function(cb) {
                transfer('settings', arguments);
            },

            /**
                updateSettings

                @description
                <a href="https://dev.twitter.com/docs/api/1/POST/account/settings">POST /account/settings</a>

                @public
                @name dotcloud.twitter#updateSettings
                @function
				@param {Object} params
				@param {Function} cb 
				 
            */  
            // *params as specified <a href="https://dev.twitter.com/docs/api/1/post/account/settings">here</a>
            updateSettings: function(params, cb) {
                transfer('updateSettings', arguments);
            },

            // ### Notifications
            /**
                follow

                @description
                <a href="https://dev.twitter.com/docs/api/1/POST/notifications/follow">POST /notifications/follow</a>

                @public
                @name dotcloud.twitter#follow
                @function
				@param {String} user
				@param {Function} cb 
				 
            */  
            // *user* can be either a `screen_name` or `user_id`.
            follow: function(user, cb) {
                transfer('follow', arguments);
            },
            /**
                leave

                @description
                <a href="https://dev.twitter.com/docs/api/1/POST/notifications/leave">POST /notifications/leave</a>

                @public
                @name dotcloud.twitter#leave
                @function
				@param {String} user
				@param {Function} cb 
				 
            */  
            // *user* can be either a `screen_name` or `user_id`.
            leave: function(user, cb) {
                transfer('leave', arguments);
            },
            // ### Saved searches
            /**
                savedSearches

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/saved_searches">GET /saved\_searches</a>

                @public
                @name dotcloud.twitter#savedSearches
                @function
				@param {Function} cb
				 
            */
            savedSearches: function(cb) {
                transfer('savedSearches', arguments);
            },
            /**
                showSavedSearch

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/saved_searches/show/:id">GET /saved\_searches/show/:id</a>

                @public
                @name dotcloud.twitter#showSavedSearch
                @function
				@param {String} id
				@param {Function} cb 
				 
            */  
            // *id*: identifier for the saved search
            showSavedSearch: function(id, cb) {
                transfer('showSavedSearch', arguments);
            },
            /**
                createSavedSearch

                @description
                <a href="https://dev.twitter.com/docs/api/1/POST/saved_searches/create">POST /saved\_searches/create</a>

                @public
                @name dotcloud.twitter#createSavedSearch
                @function
				@param {Object} query
				@param {Function} cb 
				 
            */  
            // *query*: search query that needs to be saved
            createSavedSearch: function(query, cb) {
                transfer('createSavedSearch', arguments);
            },
            /**
                destroySavedSearch

                @description
                <a href="https://dev.twitter.com/docs/api/1/POST/saved_searches/destroy/:id">POST /saved\_searches/destroy/:id</a>

                @public
                @name dotcloud.twitter#destroySavedSearch
                @function
				@param {String} id
				@param {Function} cb 
				 
            */  
            // *id*: identifier for the saved search
            destroySavedSearch: function(id, cb) {
                transfer('destroySavedSearch', arguments);
            },

            // ### Geolocation
            /**
                geoId

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/geo/id/:place_id">GET /geo/id/:place\_id</a>

                @public
                @name dotcloud.twitter#geoId
                @function
				@param {String} placeId
				@param {Function} cb 
				 
            */  
            // *placeId*: Identifier for the place we need information on
            geoId: function(placeId, cb) {
                transfer('geoId', arguments);
            },
            /**
                reverseGeocode

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/geo/reverse_geocode">GET /geo/reverse\_geocode</a>

                @public
                @name dotcloud.twitter#reverseGeocode
                @function
				@param {String} latitude
				@param {String} longitude
				@param {Object} [params]
				 
            */
            // *latitude*, *longitude*: place coordinates.  
            // *params* as specified <a href="https://dev.twitter.com/docs/api/1/get/geo/reverse_geocode">here</a>
            reverseGeocode: function(latitude, longitude, params, cb) {
                transfer('reverseGeocode', arguments);
            },
            /**
                searchGeo

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/geo/search">GET /geo/search</a>

                @public
                @name dotcloud.twitter#searchGeo
                @function
				@param {Object} query
				@param {Object} [params]
				@param {Function} cb
				 
            */  
            // *query*: Search query  
            // *params* as specified <a href="https://dev.twitter.com/docs/api/1/get/geo/search">here</a>
            searchGeo: function(query, params, cb) {
                transfer('searchGeo', arguments);
            },
            /**
                similarPlaces

                @description
                <a href="https://dev.twitter.com/docs/api/1/get/geo/similar_places">GET /geo/similar\_places</a>

                @public
                @name dotcloud.twitter#similarPlaces
                @function // latitude, longitude, name, [params], cb
 
            */  
            // *latitude*, *longitude*: place coordinates.  
            // *name* of the place referred to.  
            // *params* as specified <a href="https://dev.twitter.com/docs/api/1/get/geo/similar_places">here</a>
            similarPlaces: function(latitude, longitude, name, params, cb) {
                transfer('similarPlaces', arguments);
            },
            /**
                createPlace

                @description
                <a href="https://dev.twitter.com/docs/api/1/POST/geo/place">POST /geo/place</a>

                @public
                @name dotcloud.twitter#createPlace
                @function
				@param {Object} params
				@param {Function} cb 
				 
            */
            createPlace: function(params, cb) {
                transfer('createPlace', arguments);
            },

            // ### Trends
            /**
                trends

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/trends/:woeid">GET /trends/:woeid</a>

                @public
                @name dotcloud.twitter#trends
                @function
				@param {Object} woeid
				@param {Object} [exclude]
				@param {Function} cb
				 
            */  
            // *woeid*: The Yahoo! Where On Earth ID of the location to return trending information for. Global information is available by using 1 as the WOEID.  
            // *exclude*: Setting this equal to hashtags will remove all hashtags from the trends list.
            trends: function(woeid, exclude, cb) {
                transfer('trends', arguments);
            },
            /**
                availableTrends

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/trends/available">GET /trends/available</a>

                @public
                @name dotcloud.twitter#availableTrends
                @function
				@param {String} latitude
				@param {String} longitude
				@param {Function} cb
				 
            */  
            // *latitude*, *longitude*: place coordinates.
            availableTrends: function(latitude, longitude, cb) {
                transfer('dailyTrends', arguments);
            },
            /**
                dailyTrends

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/trends/daily">GET /trends/daily</a>

                @public
                @name dotcloud.twitter#dailyTrends
                @function
				@param {Object} [params]
				@param {Function} cb 
				 
            */  
            // *params*: see <a href="https://dev.twitter.com/docs/api/1/GET/trends/daily">GET /trends/daily</a>
            dailyTrends: function(params, cb) {
                transfer('dailyTrends', arguments);
            },
            /**
                weeklyTrends

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/trends/weekly">GET /trends/weekly</a>

                @public
                @name dotcloud.twitter#weeklyTrends
                @function
				@param {Object} [params]
				@param {Function} cb 
				 
            */  
            // *params*: see <a href="https://dev.twitter.com/docs/api/1/GET/trends/weekly">GET /trends/weekly</a>
            weeklyTrends: function(params, cb) {
                transfer('weeklyTrends', arguments);
            },

            // ### Help
            /**
                test

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/help/test">GET /help/test</a>

                @public
                @name dotcloud.twitter#test
                @function
				@param {Function} cb
				 
            */
            test: function(cb) {
                transfer('test', [cb]);
            },
            /**
                config

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/help/configuration">GET /help/configuration</a>

                @public
                @name dotcloud.twitter#config
                @function
				@param {Function} cb
				 
            */
            config: function(cb) {
                transfer('config', [cb], true);
            },
            /**
                languages

                @description
                <a href="https://dev.twitter.com/docs/api/1/GET/help/languages">GET /help/languages</a>

                @public
                @name dotcloud.twitter#languages
                @function
				@param {Function} cb
				 
            */
            languages: function(cb) {
                transfer('languages', [cb], true);
            },

            // ### Search API
            /**
                search

                @description
                <a href="https://dev.twitter.com/docs/api/1/get/search">GET /search</a>

                @public
                @name dotcloud.twitter#search
                @function
				@param {Object} query
				@param {Object} [params]
				@param {Function} cb
				 
            */
            search: function(query, params, cb) {
                transfer('search', arguments, true);
            },

            // ## Streaming API
            /**
                sampleStream

                @description
                <a href="https://dev.twitter.com/docs/api/1/get/statuses/sample">GET /statuses/sample</a>

                @public
                @name dotcloud.twitter#sampleStream
                @function
				@param {Object} [params]
				@param {Function} cb 
				 
            */
            sampleStream: function(params, cb) {
                transfer('sampleStream', arguments);
            },
            /**
                filteredStream

                @description
                <a href="https://dev.twitter.com/docs/api/1/post/statuses/filter">POST /statuses/filter</a>

                @public
                @name dotcloud.twitter#filteredStream
                @function
				@param {Object} [params]
				@param {Function} cb 
				 
            */
            filteredStream: function(params, cb) {
                transfer('filteredStream', arguments);
            },
            /**
                firehose

                @description
                <a href="https://dev.twitter.com/docs/api/1/get/statuses/firehose">GET /statuses/sample</a>

                @public
                @name dotcloud.twitter#firehose
                @function
				@param {Object} [params]
				@param {Function} cb 
				 
            */
            firehose: function(params, cb) {
                transfer('firehose', arguments);
            },
            /**
                siteStream

                @description
                <a href="https://dev.twitter.com/docs/api/2b/get/site">GET /site</a>

                @public
                @name dotcloud.twitter#siteStream
                @function
				@param {Object} follow
				@param {Object} [params]
				@param {Function} cb
				 
            */
            siteStream: function(follow, params, cb) {
                transfer('siteStream', arguments);
            },
            /**
                userStream

                @description
                <a href="https://dev.twitter.com/docs/api/2/get/user">GET /user</a>

                @public
                @name dotcloud.twitter#userStream
                @function
				@param {Object} [params]
				@param {Function} cb 
				 
            */
            userStream: function(params, cb) {
                transfer('userStream', arguments);
            },

            // ## OAuth
            /**
                requestToken

                @description

                @public
                @name dotcloud.twitter#requestToken
                @function
				@param {Function} cb
				 
            */  
            // First step in OAuth process, obtains a request token.
            requestToken: function(cb) {
                transfer('requestToken', [config.host, cb], true);
            },
            /**
                accessToken

                @description

                @public
                @name dotcloud.twitter#accessToken
                @function
				@param {Object} requestToken
				@param {Object} secret
				@param {Function} cb
				 
            */  
            // Second step in OAuth process. Provided with a *requestToken* key and 
            // *secret*, obtain an `access_token` after redirecting the user through
            // the twitter page and back.
            accessToken: function(requestToken, secret, cb) {
                if (!appService) throw 'Twitter service was not initialized.';

                var listener = function(e) {
                    if (e.origin !== config.host)
                        return;
                    var data = JSON.parse(e.data);

                    if (data.token != requestToken) {
                        return cb({ error: 'Received token is different from sent token' });
                    }

                    io.call(appService, 'accessToken')(data.verifier, data.token, secret, function(result) {
                        if (!result.error) {
                            accessToken = { key: result.key, secret: result.secret };
                        }
                        cb(result);
                    });
                    window.removeEventListener('message', listener);
                };
                window.addEventListener('message', listener);
                window.open('https://api.twitter.com/oauth/authenticate?oauth_token=' + 
                    requestToken);
            },
            /**
                auth

                @description

                @public
                @name dotcloud.twitter#auth
                @function
				@param {Function} cb
				 
            */  
            // Chains all steps of the OAuth process and saves the obtained
            // `access_token` in a cookie for future sessions.
            auth: function(cb) {
                if (!appService) throw 'Twitter service was not initialized.';

                var cookie = JSON.parse($.cookie('dotcloudjs-twitter.' + appKey));
                if (cookie && cookie.screen_name) {
                    accessToken = { key: cookie.key, secret: cookie.secret };
                    return cb(cookie);
                }
                var self = this;
                this.requestToken(function(result) {
                    if (result.error) {
                        return cb(result);
                    }
                    self.accessToken(result.token, result.secret, function(r2) {
                        if (r2.error) {
                            return cb(r2);
                        }
                        $.cookie('dotcloudjs-twitter.' + r2.appKey, 
                            JSON.stringify(r2), { expires: 9001, path: '/' });
                        accessToken = { key: r2.key, secret: r2.secret };
                        cb(r2);
                    });
                });
            },

            /**
                logout

                @description

                @public
                @name dotcloud.twitter#logout
                @function
				@param {Object} [cb]
				 
            */  
            // Remove the `access_token` cookie and unauthenticate the user.
            logout: function(cb) {
                if (!appKey) throw 'Twitter service was not initialized.';
                $.cookie('dotcloudjs-twitter.' + appKey, null, { path: '/' });
                accessToken = null;
                cb && cb();
            },

            /**
                setAccessToken

                @description

                @public
                @name dotcloud.twitter#setAccessToken
                @function
				@param {Object} key
				@param {Object} secret 
				 
            */  
            // Set the access token manually (for example, an access token can be 
            // obtained through the twitter developers site.)
            setAccessToken: function(key, secret) {
                accessToken = { key: key, secret: secret };
            }
        };

        return module;
    };
});
